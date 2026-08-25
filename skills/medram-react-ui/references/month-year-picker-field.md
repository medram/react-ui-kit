# Month Year Picker Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/month-year-picker-field
```

Generated source: `components/ui/month-year-picker-field.tsx`.

## Dependencies

- shadcn registry items: button, label, medram/react-ui-kit/form-error, medram/react-ui-kit/help, popover, select
- npm packages: date-fns, formik, lucide-react
- runtime prerequisites: Formik form context with a matching initial value.

## Contract

- Source of truth: [`registry/source/fields/MonthYearPickerField.tsx`](../../../registry/source/fields/MonthYearPickerField.tsx).
- Exported declarations: `MonthYearPickerField`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
