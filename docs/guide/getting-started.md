# Getting started

## Install

```bash
pnpm add @flowui/ui
```

If you plan to use the Formik-ready field layer, install `formik` in the host app too.
## Add the Tailwind preset

```ts
import preset from "@flowui/ui/tailwind"

const config = {
  presets: [preset],
}

export default config
```

Host apps also need Tailwind content scanning for the packaged build output:

```ts
content: ["./node_modules/@flowui/ui/dist/**/*.{js,mjs}"]
```

## Load design tokens

Import the shared stylesheet once near the top of your app shell:

```ts
import "@flowui/ui/styles.css"
```

Skip this only if the host app already defines the same CSS variables.
## Import components

Use the root entrypoint for shared widgets and helpers:

```tsx
import { SubmitButton, Tabs } from "@flowui/ui"
```

Use subpaths when you want a narrower dependency boundary:

```tsx
import { InputField } from "@flowui/ui/fields"
import { Wizard } from "@flowui/ui/wizard"
import { Button } from "@flowui/ui/primitives"
```

For form-heavy screens, the clean default is:

- field components from `@flowui/ui/fields`
- shared helpers such as `SubmitButton` from `@flowui/ui`

## Upload and webcam flows

Components that access attachments require `CloudStorageProvider` from `@flowui/ui/cloud-storage`.

The modal webcam field is a special case:

- `WebcamImageUploader` needs `CloudStorageProvider`
- `WebcamImageUploadModal` needs `CloudStorageProvider` + `StackedModalsProvider` + Formik

```tsx
import { CloudStorageProvider } from "@flowui/ui/cloud-storage"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CloudStorageProvider value={{ /* app upload implementation */ }}>
      {children}
    </CloudStorageProvider>
  )
}
```

The provider contract is documented in the [cloud storage reference](/reference/cloud-storage).
