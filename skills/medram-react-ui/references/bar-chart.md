# Bar Chart

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/bar-chart
```

Generated source: `components/ui/bar-chart.tsx`.

## Dependencies

- shadcn registry items: chart, medram/react-ui-kit/bar-chart-content, medram/react-ui-kit/base-chart-card, medram/react-ui-kit/medram-utils, table
- npm packages: @medram/react-ui-kit
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/charts/BarChart.tsx`](../../../registry/source/charts/BarChart.tsx).
- Exported declarations: `BarChartDataItem`, `BarChartProps`, `BarChart`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
