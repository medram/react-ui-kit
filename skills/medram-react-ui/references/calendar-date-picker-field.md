# Calendar Date Picker Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/calendar-date-picker-field
```

Generated source: `components/ui/calendar-date-picker-field.tsx`.

## Dependencies

- shadcn registry items: label, medram/react-ui-kit/calendar-date-picker, medram/react-ui-kit/form-error, medram/react-ui-kit/help
- npm packages: formik, react-day-picker
- runtime prerequisites: Formik form context with a matching initial value.

## Contract

- Source of truth: [`registry/source/fields/CalendarDatePickerField.tsx`](../../../registry/source/fields/CalendarDatePickerField.tsx).
- Exported declarations: `CalendarDatePickerField`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Year bounds

The field delegates calendar controls to `CalendarDatePicker`. Use `yearsRange`, `yearsOrder`, `minYear`, `maxYear`, `preventFuture`, `startMonth`, and `endMonth` to control the available years and navigation bounds.

```tsx
<CalendarDatePickerField
  name="reviewWindow"
  startMonth={new Date(2020, 0)}
  endMonth={new Date(2030, 11)}
  yearsOrder="asc"
/>
```

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
