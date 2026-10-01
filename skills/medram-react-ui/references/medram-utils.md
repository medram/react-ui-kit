# Medram Utilities

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/medram-utils
```

Generated source: `components/ui/medram-utils.ts`.

## Dependencies

- shadcn registry items: None.
- npm packages: date-fns-tz.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/shared/medram-utils.ts`](../../../registry/source/shared/medram-utils.ts).
- Exported declarations: `formatCurrency`, `generateColorsFromString`, `convertTimetoDate`, `AVAILABLE_TIMEZONES_OPTIONS`, `resolveTimeZone`, `createCalendarDate`, `lastDayOfCalendarMonth`, `parseCalendarDate`, `formatCalendarDate`, `instantToWallTime`, `wallTimeToInstant`, `currentDateInTimeZone`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Timezone and calendar helpers

`resolveTimeZone` validates an explicit IANA timezone and otherwise reads `NEXT_PUBLIC_APPLICATION_TIME_ZONE`. The date helpers keep calendar-only values as local component carriers, while `instantToWallTime` and `wallTimeToInstant` convert instants for a resolved timezone. Calendar values use strict `YYYY-MM-DD` parsing and formatting.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
