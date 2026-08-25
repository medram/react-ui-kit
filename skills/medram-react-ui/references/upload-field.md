# Upload Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/upload-field
```

Generated source: `components/ui/upload-field.tsx`.

## Dependencies

- shadcn registry items: medram/react-ui-kit/form-error, medram/react-ui-kit/help, medram/react-ui-kit/upload-input
- npm packages: @medram/react-ui-kit, @radix-ui/react-label, formik
- runtime prerequisites: Formik form context with a matching initial value.

## Contract

- Source of truth: [`registry/source/fields/UploadField.tsx`](../../../registry/source/fields/UploadField.tsx).
- Exported declarations: `UploadFieldProps`, `UploadField`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
