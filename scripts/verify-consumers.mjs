import { execFile } from "node:child_process"
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"

const run = promisify(execFile)
const root = process.cwd()
const workspace = await mkdtemp(path.join(tmpdir(), "medram-consumers-"))

async function command(file, args, cwd) {
  try {
    await run(file, args, { cwd, maxBuffer: 10 * 1024 * 1024 })
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join("\n")
    throw new Error(`${file} ${args.join(" ")} failed in ${cwd}\n${output}`)
  }
}

try {
  const artifacts = path.join(workspace, "artifacts")
  await mkdir(artifacts)
  await command("pnpm", ["pack", "--pack-destination", artifacts], root)
  const tarball = path.join(artifacts, "medram-react-ui-kit-0.2.0.tgz")

  for (const [name, reactVersion] of [["react18", "18.3.1"], ["react19", "19.2.0"]]) {
    const fixture = path.join(workspace, name)
    await mkdir(path.join(fixture, "src"), { recursive: true })
    await writeFile(
      path.join(fixture, "package.json"),
      JSON.stringify(
        {
          private: true,
          type: "module",
          scripts: { build: "vite build" },
          dependencies: {
            "@medram/react-ui-kit": `file:${tarball}`,
            "@tailwindcss/vite": "4.3.0",
            "@vitejs/plugin-react": "6.1.0",
            react: reactVersion,
            "react-dom": reactVersion,
            tailwindcss: "4.3.0",
            vite: "8.2.2",
          },
        },
        null,
        2,
      ),
    )
    await writeFile(path.join(fixture, "index.html"), '<div id="root"></div><script type="module" src="/src/main.tsx"></script>')
    await writeFile(path.join(fixture, "src/styles.css"), '@import "tailwindcss";\n')
    await writeFile(
      path.join(fixture, "src/main.tsx"),
      `import { createRoot } from "react-dom/client"\nimport { CloudStorageProvider, useCloudStorageContext } from "@medram/react-ui-kit/cloud-storage"\nimport "./styles.css"\n\nconst attachment = { id: "fixture", name: "fixture", file: "fixture", size: 0, is_used: false, tag: "", link: "", updated: "", created: "" }\nconst storage = { uploadFile: async () => attachment, fetchAttachment: async () => attachment, deleteAttachment: async () => {} }\nfunction Probe() { useCloudStorageContext(); return <output>ready</output> }\ncreateRoot(document.getElementById("root")!).render(<CloudStorageProvider value={storage}><Probe /></CloudStorageProvider>)\n`,
    )
    await writeFile(
      path.join(fixture, "vite.config.ts"),
      'import { defineConfig } from "vite"\nimport react from "@vitejs/plugin-react"\nimport tailwindcss from "@tailwindcss/vite"\nexport default defineConfig({ plugins: [react(), tailwindcss()] })\n',
    )
    await command("pnpm", ["install", "--config.auto-install-peers=false"], fixture)
    await command("pnpm", ["build"], fixture)
    await command(
      "node",
      [
        "--input-type=module",
        "--eval",
        'import("@medram/react-ui-kit").then(() => process.exitCode = 1).catch((error) => { if (error.code !== "ERR_PACKAGE_PATH_NOT_EXPORTED") throw error })',
      ],
      fixture,
    )
  }

  const nextFixture = path.join(workspace, "next")
  await mkdir(path.join(nextFixture, "app"), { recursive: true })
  await writeFile(
    path.join(nextFixture, "package.json"),
    JSON.stringify(
      {
        private: true,
        scripts: { build: "next build" },
        dependencies: { next: "latest", react: "latest", "react-dom": "latest", tailwindcss: "4.3.0" },
        devDependencies: { "@tailwindcss/postcss": "4.3.0", typescript: "latest", "@types/node": "latest", "@types/react": "latest", "@types/react-dom": "latest" },
      },
      null,
      2,
    ),
  )
  await writeFile(
    path.join(nextFixture, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          strict: true,
          noEmit: true,
          module: "esnext",
          moduleResolution: "bundler",
          jsx: "preserve",
          esModuleInterop: true,
          resolveJsonModule: true,
          isolatedModules: true,
          paths: { "@/*": ["./*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      },
      null,
      2,
    ),
  )
  await writeFile(path.join(nextFixture, "next.config.ts"), 'import type { NextConfig } from "next"\nexport default {} satisfies NextConfig\n')
  await writeFile(path.join(nextFixture, "postcss.config.mjs"), 'export default { plugins: { "@tailwindcss/postcss": {} } }\n')
  await writeFile(path.join(nextFixture, "app/globals.css"), '@import "tailwindcss";\n')
  await writeFile(path.join(nextFixture, "app/layout.tsx"), 'import "./globals.css"\nexport default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html> }\n')
  await writeFile(
    path.join(nextFixture, "app/page.tsx"),
    [
      'import CardBox from "@/components/ui/card-box"',
      'import { DataTable } from "@/components/ui/data-table"',
      'import generateColumnsDefinition from "@/components/ui/data-table-columns"',
      'import { PaginatedDataTable } from "@/components/ui/paginated-data-table"',
      'import type { ColumnDef } from "@tanstack/react-table"',
      "type RowData = { id: number; name: string }",
      "",
      "const columns: ColumnDef<RowData>[] = [{ accessorKey: \"name\", header: \"Name\" }]",
      "const generatedColumns = generateColumnsDefinition<RowData>({",
      "  columnsDef: [{ accessorKey: \"name\", title: \"Name\" }],",
      "})",
      "const pagination = {",
      "  page: 1,",
      "  page_size: 10,",
      "  query: \"\",",
      "  setPage: () => {},",
      "  setPageSize: () => {},",
      "}",
      "",
      "export default function Page() {",
      "  const rows = [{ id: 1, name: \"fixture\" }]",
      "  return (",
      "    <main>",
      "      <CardBox title=\"Registry fixture\">ready</CardBox>",
      "      <DataTable columns={columns} data={rows} hidePagination />",
      "      <PaginatedDataTable",
      "        columns={generatedColumns}",
      "        paginatedData={{ results: rows, count: rows.length, page_size: 10 }}",
      "        pagination={pagination}",
      "      />",
      "    </main>",
      "  )",
      "}",
      "",
    ].join("\n"),
  )
  await command("pnpm", ["dlx", "shadcn@latest", "add", path.join(root, "public/r/card-box.json"), "--yes"], nextFixture)
  await command("pnpm", ["dlx", "shadcn@latest", "add", path.join(root, "public/r/table.json"), "--yes"], nextFixture)
  await command("pnpm", ["build"], nextFixture)

  console.log("verified React 18, React 19, and latest Next.js consumer fixtures")
} finally {
  await rm(workspace, { recursive: true, force: true })
}
