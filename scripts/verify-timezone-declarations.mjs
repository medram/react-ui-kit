import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import * as ts from "typescript"

const distDirectory = resolve("dist")
const declarationFiles = []

function collectDeclarations(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) {
      collectDeclarations(path)
    } else if (path.endsWith(".d.ts")) {
      declarationFiles.push(path)
    }
  }
}

function typeName(typeNode) {
  return ts.isTypeReferenceNode(typeNode) ? typeNode.typeName.getText() : undefined
}

function hasStringTimezoneProperty(typeNode, aliases, visited = new Set()) {
  if (!typeNode) return false

  if (ts.isParenthesizedTypeNode(typeNode)) {
    return hasStringTimezoneProperty(typeNode.type, aliases, visited)
  }

  if (ts.isIntersectionTypeNode(typeNode) || ts.isUnionTypeNode(typeNode)) {
    return typeNode.types.some((member) => hasStringTimezoneProperty(member, aliases, visited))
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    return typeNode.members.some(
      (member) =>
        ts.isPropertySignature(member) &&
        member.name?.getText() === "timezone" &&
        Boolean(member.questionToken) &&
        member.type?.kind === ts.SyntaxKind.StringKeyword,
    )
  }

  const aliasName = typeName(typeNode)
  if (!aliasName || visited.has(aliasName)) return false

  const alias = aliases.get(aliasName)
  if (!alias) return false

  visited.add(aliasName)
  return hasStringTimezoneProperty(alias.type, aliases, visited)
}

if (!statSync(distDirectory, { throwIfNoEntry: false })?.isDirectory()) {
  console.error("dist/ is missing; run pnpm build first")
  process.exit(1)
}

collectDeclarations(distDirectory)

const sourceFiles = declarationFiles.map((filePath) =>
  ts.createSourceFile(
    filePath,
    readFileSync(filePath, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  ),
)
const aliases = new Map()
const functions = new Map()

for (const sourceFile of sourceFiles) {
  function collect(node) {
    if (ts.isTypeAliasDeclaration(node)) aliases.set(node.name.text, node)
    if (ts.isFunctionDeclaration(node) && node.name) functions.set(node.name.text, node)
    ts.forEachChild(node, collect)
  }

  collect(sourceFile)
}

const failures = []
for (const component of ["DatePickerField", "DateSelectorField", "DateTimePickerField", "MonthYearPickerField"]) {
  const declaration = functions.get(component)
  const propsType = declaration?.parameters[0]?.type
  if (!declaration) {
    failures.push(`${component}: function declaration not found`)
  } else if (!hasStringTimezoneProperty(propsType, aliases)) {
    failures.push(`${component}: first parameter props type lacks optional timezone?: string`)
  }
}

if (failures.length) {
  console.error(failures.join("\n"))
  process.exit(1)
}

console.log(
  `Timezone declarations verified: ${["DatePickerField", "DateSelectorField", "DateTimePickerField", "MonthYearPickerField"].join(", ")}`,
)
console.log(`Scanned ${declarationFiles.length} declaration files under ${relative(process.cwd(), distDirectory) || "."}`)
