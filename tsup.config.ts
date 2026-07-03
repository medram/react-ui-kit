import { preserveDirectivesPlugin } from "esbuild-plugin-preserve-directives"
import { defineConfig } from "tsup"

// Subpath entry points. Each maps to an `exports` key in package.json so
// consumers only pull the peer deps for the surfaces they actually import.
export default defineConfig({
  entry: {
    index: "src/index.ts",
    "tailwind.preset": "src/tailwind.preset.ts",
    "primitives/index": "src/primitives/index.ts",
    "fields/index": "src/fields/index.ts",
    "charts/index": "src/charts/index.ts",
    "modal/index": "src/modal/index.ts",
    "wizard/index": "src/wizard/index.ts",
    "webcam/index": "src/webcam/index.ts",
    "cloud-storage/index": "src/cloud-storage/index.ts",
    "time-picker/index": "src/time-picker/index.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  // Disabled: tsup's rollup treeshake pass strips module-level "use client"
  // directives. esbuild already eliminates dead code while bundling, and
  // consumers tree-shake again at their own build.
  treeshake: false,
  // Everything the components consume is provided by the host app as a peer.
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    /^next($|\/)/,
    /^@radix-ui\//,
    "recharts",
    "formik",
    "yup",
    "date-fns",
    "date-fns-tz",
    "next-themes",
    "react-spinners",
    "react-timezone-select",
    "react-day-picker",
    "dayjs",
    "react-dropzone",
    "react-hot-toast",
    "react-webcam",
    "browser-image-compression",
    "framer-motion",
    "cmdk",
    "lucide-react",
    "pretty-bytes",
    "tailwind-merge",
    "clsx",
    "class-variance-authority",
    "tailwindcss",
    "tailwindcss-animate",
    "tailwind-scrollbar",
  ],
  // Preserve per-file `"use client"` directives through bundling so the package
  // works inside a Next.js RSC app. A global banner is stripped by the bundler
  // and would also wrongly mark pure modules (e.g. the Tailwind preset).
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ["use client", "use server"],
      include: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
    }),
  ],
  // tsup does not copy non-entry assets; ship the design tokens alongside dist.
  onSuccess: "mkdir -p dist/styles && cp src/styles/tokens.css dist/styles/tokens.css",
})
