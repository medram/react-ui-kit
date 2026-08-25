# Time Picker

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/time-picker
```

Generated source: `components/ui/time-picker.tsx`.

## Dependencies

- shadcn registry items: input, select
- npm packages: lucide-react
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/time-picker/TimePicker.tsx`](../../../registry/source/time-picker/TimePicker.tsx).
- Exported declarations: default component export.
- Owns local interaction state; use documented callback props to observe or control it.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
