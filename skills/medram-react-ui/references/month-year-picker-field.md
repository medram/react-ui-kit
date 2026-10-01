# Month Year Picker Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/month-year-picker-field
```

Generated source: `components/ui/month-year-picker-field.tsx`.

## Dependencies

- shadcn registry items: button, label, medram/react-ui-kit/form-error, medram/react-ui-kit/help, medram/react-ui-kit/medram-utils, popover, select
- npm packages: date-fns, date-fns-tz, formik, lucide-react
- runtime prerequisites: Formik form context with a matching initial value.

## Contract

- Source of truth: [`registry/source/fields/MonthYearPickerField.tsx`](../../../registry/source/fields/MonthYearPickerField.tsx).
- Exported declarations: `MonthYearPickerField`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Value and year options

The field stores an ISO date string using `defaultDay` (default `1`) as the day component, while the trigger displays only the selected month and year. If `defaultDay` exceeds the selected month's length, it is clamped to the last valid day.

The field defaults to the current year plus the previous three years, ordered descending. Use `minYear` and `maxYear` for explicit bounds, or `yearsRange` to control the relative range when a bound is omitted. Set `yearsOrder="asc"` for ascending options.

```tsx
<MonthYearPickerField
  name="billingMonth"
  defaultDay={1}
  minYear={2020}
  maxYear={2030}
  yearsOrder="asc"
/>
```

## Timezone and stored values

Pass an IANA timezone through `timezone`, or set `NEXT_PUBLIC_APPLICATION_TIME_ZONE` for the application default. A valid explicit prop takes precedence over the environment value. The field stores strict `YYYY-MM-DD` calendar strings; the resolved timezone supplies the current-year fallback when `maxYear` is not provided.

```tsx
<MonthYearPickerField
  name="billingMonth"
  timezone="America/New_York"
/>
```

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
