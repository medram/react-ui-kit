# @medram/react-ui-kit

Medram workflow components are installed as editable shadcn source. The npm package ships only the Cloud Storage contract and shared TypeScript types.

## Install a visual component

Initialize shadcn with the Radix base. Medram registry sources use the current Radix compound-component API:

```bash
pnpm dlx shadcn@latest init --base radix
```

Then install a workflow:

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/input-field
```

The registry installs its declared shadcn primitives and feature dependencies into the consuming application. Import generated source from `@/components/ui/...`; never import a Medram visual component from npm.

For upstream-only composition:

```bash
pnpm dlx shadcn@latest add button card
```

## Cloud Storage contract

Install the npm package only when a Medram upload workflow needs application-owned storage operations:

```bash
pnpm add @medram/react-ui-kit
```

```tsx
import { CloudStorageProvider } from "@medram/react-ui-kit/cloud-storage"
```

See the [documentation](https://medram.github.io/react-ui-kit/) for the provider contract, registry catalogue, and Tailwind 4.3 setup.

## Styling

Use the consumer application’s shadcn Tailwind 4 CSS-first setup. This package provides no Tailwind preset, stylesheet, content glob, or design-token override.

## License

No license has been granted for this package. Use requires permission from the package owner.
