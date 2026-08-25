# Bar Chart Content

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/bar-chart-content
```

Generated source: `components/ui/bar-chart-content.tsx`.

## Dependencies

- shadcn registry items: card, chart, medram/react-ui-kit/bar-chart, separator, table
- npm packages: recharts
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/charts/BarChart.content.tsx`](../../../registry/source/charts/BarChart.content.tsx).
- Exported declarations: `BarChartContentProps`, `BarChartContent`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
