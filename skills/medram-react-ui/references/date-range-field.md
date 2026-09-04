# Date Range Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/date-range-field
```

Generated source: `components/ui/date-range-field.tsx`.

## Dependencies

- shadcn registry items: button, calendar, label, medram/react-ui-kit/form-error, medram/react-ui-kit/help, popover
- npm packages: date-fns, formik, lucide-react
- runtime prerequisites: Formik form context with a matching initial value.

## Contract

- Source of truth: [`registry/source/fields/DateRangeField.tsx`](../../../registry/source/fields/DateRangeField.tsx).
- Exported declarations: `DateRangeField`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Quick ranges and navigation

On desktop, the default `numberOfMonths={2}` layout includes quick range buttons for:

- `Today`
- `Yesterday`
- `This Week`
- `Last Week`
- `Last 7 Days`
- `This Month`
- `Last Month`
- `This Year`
- `Last Year`

Selecting a preset updates the Formik field's `from` and `to` values and highlights that preset. Selecting a date manually clears the active preset.

The calendar uses shadcn's `captionLayout="dropdown"` so users can change months and years directly from the calendar captions.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
