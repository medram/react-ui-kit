# Setup and runtime

## Install and load tokens

```bash
pnpm add @medram/react-ui-kit
```

Import package tokens once in the client-facing app shell or global stylesheet:

```ts
import "@medram/react-ui-kit/styles.css"
```

Skip this only when the host deliberately owns the same CSS variables. Otherwise token-backed utility classes render unthemed.

## Tailwind configuration

Use the preset before local extensions, then scan the package build output:

```ts
import preset from "@medram/react-ui-kit/tailwind"

const config = {
  presets: [preset],
  content: ["./node_modules/@medram/react-ui-kit/dist/**/*.{js,mjs}"],
  theme: {
    extend: {
      // Host additions follow the preset.
    },
  },
}

export default config
```

The preset supplies class-based dark mode, CSS-variable token colors and radii, accordion animations, `tailwindcss-animate`, and `tailwind-scrollbar`. Extend it locally instead of rebuilding those token mappings.

Missing token styles leave CSS-variable utilities unthemed. Missing the content glob lets Tailwind remove package utility classes from production CSS.

## Legal consumer imports

Use only the package manifest entrypoints:

```ts
import { SubmitButton } from "@medram/react-ui-kit"
import { InputField } from "@medram/react-ui-kit/fields"
import { Dialog } from "@medram/react-ui-kit/primitives"
import { AreaChart } from "@medram/react-ui-kit/charts"
import { StackedModalsProvider } from "@medram/react-ui-kit/modal"
import { Wizard } from "@medram/react-ui-kit/wizard"
import { WebcamImageUploader } from "@medram/react-ui-kit/webcam"
import { TimePicker } from "@medram/react-ui-kit/time-picker"
import { CloudStorageProvider } from "@medram/react-ui-kit/cloud-storage"
```

Never import `src/**`, `dist/**`, chart `*.content`, `useCloudStorageOps`, or source-only modal internals. If the installed package version differs from 0.1.3, read that version's `package.json#exports` and `.d.ts` files before selecting a symbol.

## Next.js client boundary

The build preserves package-level `"use client"` directives, but that does not make a host server component interactive. Put host components that own hooks, callbacks, Formik, providers, charts, webcam, Radix primitives, or hash-driven root tabs behind a client boundary:

```tsx
// app/profile/client-form.tsx
"use client"

import { Formik } from "formik"
import { InputField } from "@medram/react-ui-kit/fields"

export function ClientProfileForm() {
  return (
    <Formik initialValues={{ name: "" }} onSubmit={async () => {}}>
      <InputField name="name" />
    </Formik>
  )
}
```

Fetch data in the server component above this boundary, then pass serializable props into the client child. Do not move server data access into an interactive package component merely to avoid making a client child.

## Feature peers

All listed peers are package-manager peers; `peerDependenciesMeta.optional` only means installation is deferred. It is not a runtime fallback. Install the peer before rendering its feature, or module resolution/runtime behavior can fail.

| Feature                      | Install the peers it uses                                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Primitive composition        | Relevant `@radix-ui/*` packages, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`                                  |
| Formik fields and validation | `formik`; `yup` for `DateRangeYupSchema`; `date-fns`, `date-fns-tz`, `dayjs`, and `react-day-picker` for applicable date/time controls |
| Charts                       | `recharts`                                                                                                                             |
| Attachments and upload UI    | `react-dropzone`, `browser-image-compression`, `react-hot-toast`, and `pretty-bytes` when the selected upload path uses them           |
| Webcam                       | `react-webcam` plus the upload peers and `CloudStorageProvider` adapter                                                                |
| Timezone fields              | `react-timezone-select`, plus applicable date/time peers                                                                               |
| Root tabs and visual helpers | `next`, `next-themes`, `framer-motion`, or `react-spinners` when the selected helper uses them                                         |
| Tailwind preset              | `tailwindcss`, `tailwindcss-animate`, and `tailwind-scrollbar`                                                                         |

Fix a missing feature peer by installing it in the host app. Do not rewrite a package import to an internal file to make a peer resolution error disappear.

## Runtime diagnosis

| Symptom                                                     | Source fix                                                                                    |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Components have wrong colors, borders, or radii             | Load `styles.css` once, or intentionally provide identical variables in the host.             |
| Package layout works locally but loses styles in production | Add the exact package content glob to Tailwind.                                               |
| Next.js reports hooks or event-handler boundary errors      | Move the package composition into a client component or client child.                         |
| Field or submit component cannot see form state             | Render it below the owning `<Formik>` and align `name` with `initialValues`.                  |
| Upload/webcam reports no storage context                    | Put one `CloudStorageProvider` above the flow; do not catch the provider error in each field. |
| Feature module cannot resolve                               | Install the peer for the selected feature.                                                    |
