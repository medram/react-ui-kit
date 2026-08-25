# Attachments Preview

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/attachments-preview
```

Generated source: `components/ui/attachments-preview.tsx`.

## Dependencies

- shadcn registry items: None.
- npm packages: @medram/react-ui-kit, lucide-react, pretty-bytes
- runtime prerequisites: CloudStorageProvider above the component tree.

## Contract

- Source of truth: [`registry/source/components/AttachmentsPreview.tsx`](../../../registry/source/components/AttachmentsPreview.tsx).
- Exported declarations: `AttachmentsPreviewProps`, `AttachmentsPreview`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
