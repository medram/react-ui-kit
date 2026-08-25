# Check In Heatmap

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/check-in-heatmap
```

Generated source: `components/ui/check-in-heatmap.tsx`.

## Dependencies

- shadcn registry items: tooltip
- npm packages: @medram/react-ui-kit, dayjs
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/components/CheckInHeatmap.tsx`](../../../registry/source/components/CheckInHeatmap.tsx).
- Exported declarations: `CheckInHeatmap`
- Owns local interaction state; use documented callback props to observe or control it.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
