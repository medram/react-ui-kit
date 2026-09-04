# Upload Input

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/upload-input
```

Generated source: `components/ui/upload-input.tsx`.

## Dependencies

- shadcn registry items: attachment, medram/react-ui-kit/attachment-inputs, medram/react-ui-kit/drop-zone
- npm packages: @medram/react-ui-kit, lucide-react, pretty-bytes, react-dropzone, react-hot-toast
- runtime prerequisites: CloudStorageProvider above the component tree.

## Contract

- Source of truth: [`registry/source/inputs/UploadInput.tsx`](../../../registry/source/inputs/UploadInput.tsx).
- Exported declarations: `UploadInputProps`, `UploadInput`
- Owns local interaction state; use documented callback props to observe or control it.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
