# Drop Zone

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/drop-zone
```

Generated source: `components/ui/drop-zone.tsx`.

## Dependencies

- shadcn registry items: medram/react-ui-kit/attachment-inputs
- npm packages: browser-image-compression, react-dropzone
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/inputs/DropZone.tsx`](../../../registry/source/inputs/DropZone.tsx).
- Exported declarations: `onUploadProps`, `DropZoneProps`, `DropZone`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
