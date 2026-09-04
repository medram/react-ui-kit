# Getting started

## Prerequisites

Use Tailwind CSS 4.3 and initialize the application with the current shadcn CLI using its Radix base:

```bash
pnpm dlx shadcn@latest init --base radix
```

Keep the generated CSS-first setup in the consumer application:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* consumer-owned semantic token mappings */
}
```

Do not add a Medram Tailwind preset, stylesheet, or `node_modules` content glob.

## Install visual workflows

Install each Medram component as source:

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/input-field
```

The registry adds its declared upstream shadcn components and feature dependencies. Import the generated component from the consumer application:

```tsx
import InputField from "@/components/ui/input-field"
```

The table workflow is installed as one item; its internal filters, pagination, and action files are implementation support. See the [table reference](/reference/table) for the full `ColumnDef`, `generateColumnsDefinition`, filter, action, and pagination contracts.

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/table
```

For ordinary UI composition without a Medram workflow, use upstream shadcn directly:

```bash
pnpm dlx shadcn@latest add button card
```

## Install the agent skill

Install the repository's `medram-react-ui` skill for the current project with
either `npx` or `pnpm`:

```bash
npx skills@latest add medram/react-ui-kit --skill medram-react-ui
pnpm dlx skills@latest add medram/react-ui-kit --skill medram-react-ui
```

To install every skill exposed by this repository, replace
`--skill medram-react-ui` with `--skill '*'`.

Append `--global` for a user-wide installation, or
`--agent claude-code` / `--agent codex` to target one coding agent.

Update the installed skill with:

```bash
npx skills@latest update medram-react-ui --yes
pnpm dlx skills@latest update medram-react-ui --yes
```

For project-scoped skills, run these commands from the consuming project
directory. Use `--global` on update when the skill was installed globally.

## Cloud Storage

Upload workflows require the headless provider package:

```bash
pnpm add @medram/react-ui-kit
```

```tsx
import { CloudStorageProvider } from "@medram/react-ui-kit/cloud-storage"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <CloudStorageProvider value={storage}>{children}</CloudStorageProvider>
}
```

`storage` owns network calls, credentials, retry behavior, and error reporting. Registry upload components only invoke the typed provider contract.
