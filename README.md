# @medram/ui

Reusable shadcn/ui component library for React and Next.js applications.

## Install

```bash
npm install @medram/ui
```

## Tailwind setup

Import the preset and add it to `presets`:

```ts
import preset from "@medram/ui/tailwind"

const config = {
  presets: [preset],
}

export default config
```

Consumers also need Tailwind content scanning for the package build output:

```ts
content: [
  "./node_modules/@medram/ui/dist/**/*.{js,mjs}",
]
```

## Design tokens

Import `@medram/ui/styles.css` once unless your host app already defines the same CSS variables.

## Available subpaths

- `.`
- `./fields`
- `./modal`
- `./primitives`
- `./charts`
- `./wizard`
- `./webcam`
- `./time-picker`
- `./cloud-storage`
- `./tailwind`
- `./styles.css`

## Cloud storage

Upload and webcam components that access attachments require `CloudStorageProvider` from `@medram/ui/cloud-storage`.

## License

No license has been granted for this package. Use requires permission from the package owner.
