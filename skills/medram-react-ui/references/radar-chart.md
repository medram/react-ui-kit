# Radar Chart

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/radar-chart
```

Generated source: `components/ui/radar-chart.tsx`.

## Dependencies

- shadcn registry items: medram/react-ui-kit/base-chart-card, medram/react-ui-kit/medram-utils, medram/react-ui-kit/radar-chart-content, table
- npm packages: @medram/react-ui-kit
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/charts/RadarChart.tsx`](../../../registry/source/charts/RadarChart.tsx).
- Exported declarations: `RadarChart`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
