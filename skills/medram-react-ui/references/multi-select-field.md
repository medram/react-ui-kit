# Multi Select Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/multi-select-field
```

Generated source: `components/ui/multi-select-field.tsx`.

## Dependencies

- shadcn registry items: input, label, medram/react-ui-kit/form-error, medram/react-ui-kit/help
- npm packages: formik, lucide-react
- runtime prerequisites: Formik form context with a matching initial value.

## Contract

- Source of truth: [`registry/source/fields/MultiSelectField.tsx`](../../../registry/source/fields/MultiSelectField.tsx).
- Exported declarations: `MultiSelectFieldProps`, `MultiSelectField`
- Owns local interaction state; use documented callback props to observe or control it.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
