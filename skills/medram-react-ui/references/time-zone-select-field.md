# Time Zone Select Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/time-zone-select-field
```

Generated source: `components/ui/time-zone-select-field.tsx`.

## Dependencies

- shadcn registry items: medram/react-ui-kit/select-field
- npm packages: react-timezone-select
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/fields/TimeZoneSelectFiels.tsx`](../../../registry/source/fields/TimeZoneSelectFiels.tsx).
- Exported declarations: `TimeZonesSelectField`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
