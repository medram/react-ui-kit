# Date Picker Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/date-picker-field
```

Generated source: `components/ui/date-picker-field.tsx`.

## Dependencies

- shadcn registry items: button, calendar, label, medram/react-ui-kit/form-error, medram/react-ui-kit/help, medram/react-ui-kit/medram-utils, popover
- npm packages: date-fns, date-fns-tz, formik, lucide-react
- runtime prerequisites: Formik form context with a matching initial value.

## Contract

- Source of truth: [`registry/source/fields/DatePickerField.tsx`](../../../registry/source/fields/DatePickerField.tsx).
- Exported declarations: `DatePickerField`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Calendar navigation

The calendar defaults to `captionLayout="dropdown"` and forwards the shadcn Calendar navigation props. Use `startMonth` and `endMonth` to control the years available in the year dropdown. `captionLayout`, `defaultMonth`, `month`, `onMonthChange`, `reverseYears`, and other DayPicker props are also available; form-owned `mode`, `selected`, `onSelect`, and `disabled` remain internal.

```tsx
<DatePickerField
  name="launchDate"
  startMonth={new Date(2020, 0)}
  endMonth={new Date(2030, 11)}
  captionLayout="dropdown-years"
/>
```

## Timezone and stored values

Pass an IANA timezone through `timezone`, or set `NEXT_PUBLIC_APPLICATION_TIME_ZONE` for the application default. A valid explicit prop takes precedence over the environment value. With the default `includingTime` behavior, ISO instants are displayed and selected in the resolved wall-clock timezone; selecting a day preserves the existing wall-clock time and writes the inverse ISO instant. Use `dateOnly` or `includingTime={false}` for calendar values stored as strict `YYYY-MM-DD` strings without a UTC date shift.

```tsx
<DatePickerField
  name="launchDate"
  timezone="America/New_York"
  includingTime
/>
```

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
