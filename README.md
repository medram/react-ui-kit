# @flowui/ui

Reusable shadcn/ui component library for React and Next.js applications.

## Install

```bash
pnpm add @flowui/ui
```

## Links

- Source: `https://github.com/medram/flowui`
- Docs: `https://medram.github.io/flowui/`
- Issues: `https://github.com/medram/flowui/issues`

## Documentation

- Repo docs source: `docs/`
- Published site: `https://medram.github.io/flowui/`
- Local preview: `pnpm docs:dev`

## Tailwind setup

Import the preset and add it to `presets`:

```ts
import preset from "@flowui/ui/tailwind"

const config = {
  presets: [preset],
}

export default config
```

Consumers also need Tailwind content scanning for the package build output:

```ts
content: [
  "./node_modules/@flowui/ui/dist/**/*.{js,mjs}",
]
```

## Design tokens

Import `@flowui/ui/styles.css` once unless your host app already defines the same CSS variables.

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

Upload and webcam components that access attachments require `CloudStorageProvider` from `@flowui/ui/cloud-storage`.

## License

No license has been granted for this package. Use requires permission from the package owner.
