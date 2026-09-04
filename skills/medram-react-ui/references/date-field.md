# Date Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/date-field
```

Generated source: `components/ui/date-field.tsx`.

## Dependencies

- shadcn registry items: button, calendar, label, medram/react-ui-kit/form-error, medram/react-ui-kit/help, popover
- npm packages: date-fns, formik, lucide-react
- runtime prerequisites: Formik form context with a matching initial value.

## Contract

- Source of truth: [`registry/source/fields/DateField.tsx`](../../../registry/source/fields/DateField.tsx).
- Exported declarations: `DateField`
- Owns local interaction state; use documented callback props to observe or control it.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Calendar navigation

The calendar uses shadcn's `captionLayout="dropdown"` so users can select or change the displayed month and year directly from the calendar caption.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
