import { access, readFile, readdir } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const root = process.cwd()
const registryPath = path.join(root, "registry.json")
const registry = JSON.parse(await readFile(registryPath, "utf8"))

if (!Array.isArray(registry.items) || registry.items.length === 0) {
  throw new Error("registry.json must define at least one item")
}

const names = new Set()
for (const item of registry.items) {
  if (names.has(item.name)) throw new Error(`duplicate registry item: ${item.name}`)
  names.add(item.name)

  if (!["registry:ui", "registry:hook"].includes(item.type)) {
    throw new Error(`${item.name} must be a registry:ui or registry:hook item`)
  }

  const referencePath = path.join(root, "skills/medram-react-ui/references", `${item.name}.md`)
  await access(referencePath)

  for (const file of item.files ?? []) {
    const sourcePath = path.join(root, file.path)
    const source = await readFile(sourcePath, "utf8")
    if (/from ["']next(?:\/|["'])/.test(source)) {
      throw new Error(`${file.path} imports Next directly; registry sources must stay React/Vite compatible`)
    }
    if (/primitives\//.test(source) || /@medram\/react-ui-kit\/(?:fields|charts|modal|primitives|webcam|wizard|time-picker)/.test(source)) {
      throw new Error(`${file.path} depends on a removed package visual surface`)
    }
  }
}

const publicItems = await readdir(path.join(root, "public/r"))
if (!publicItems.some((entry) => entry.endsWith(".json"))) {
  throw new Error("registry build did not emit item JSON")
}

console.log(`verified ${registry.items.length} registry items and ${names.size} skill references`)
