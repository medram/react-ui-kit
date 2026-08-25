# Calendar Date Picker

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/calendar-date-picker
```

Generated source: `components/ui/calendar-date-picker.tsx`.

## Dependencies

- shadcn registry items: button, calendar, popover, select
- npm packages: class-variance-authority, date-fns, date-fns-tz, lucide-react, react-day-picker
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/components/CalendarDatePicker.tsx`](../../../registry/source/components/CalendarDatePicker.tsx).
- Exported declarations: `CalendarDatePickerProps`, `CalendarDatePicker`
- Owns local interaction state; use documented callback props to observe or control it.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
