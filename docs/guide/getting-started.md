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

For ordinary UI composition without a Medram workflow, use upstream shadcn directly:

```bash
pnpm dlx shadcn@latest add button card
```

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
