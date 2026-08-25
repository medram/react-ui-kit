# Pdf Preview

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/pdf-preview
```

Generated source: `components/ui/pdf-preview.tsx`.

## Dependencies

- shadcn registry items: badge, card, medram/react-ui-kit/medram-utils, tooltip
- npm packages: @medram/react-ui-kit, dayjs, lucide-react
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/components/PDFPreview.tsx`](../../../registry/source/components/PDFPreview.tsx).
- Exported declarations: `PDFPreview`
- Owns local interaction state; use documented callback props to observe or control it.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
