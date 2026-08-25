# Basic Image Uploader Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/basic-image-uploader-field
```

Generated source: `components/ui/basic-image-uploader-field.tsx`.

## Dependencies

- shadcn registry items: label, medram/react-ui-kit/drop-zone
- npm packages: @medram/react-ui-kit, formik, lucide-react, react-dropzone, react-hot-toast
- runtime prerequisites: Formik form context with a matching initial value. CloudStorageProvider above the component tree.

## Contract

- Source of truth: [`registry/source/fields/BasicImageUploaderField.tsx`](../../../registry/source/fields/BasicImageUploaderField.tsx).
- Exported declarations: `BasicImageUploaderField`
- Owns local interaction state; use documented callback props to observe or control it.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
