# Charts

The charts package wraps Recharts in app-ready components with lazy loading, shared card chrome, and optional summaries.

For dashboard charts, start with `@flowui/ui/charts`, not the root barrel.

The `@flowui/ui/charts` barrel re-exports the chart defaults as named exports, so you can standardize on named imports.

::: info Good mental model
Every chart component focuses on one job: accept a typed data shape, render inside a standard card, and keep tooltips, legends, and summaries consistent.
:::

## Quick example

```tsx
import { AreaChart } from "@flowui/ui/charts"

const monthlyRevenue = [
  {
    label: "Revenue",
    suffix: "$",
    data: [
      { month: "Jan", total: 1200 },
      { month: "Feb", total: 1750 },
      { month: "Mar", total: 1680 },
    ],
  },
]

export function RevenueChart() {
  return (
    <AreaChart
      data={monthlyRevenue}
      headerTitle="Monthly revenue"
      headerDescription="Q1 snapshot"
      showSummary
      gradientArea
    />
  )
}
```

## Available charts

| Component | Best for | Data shape notes |
| --- | --- | --- |
| `AreaChart` | Trends over time | `data: AreaChartDataItem[]`; supports option switching, legend position, gradients, summaries. |
| `BarChart` | Comparisons across categories | `bars: BarChartDataItem[]`; supports horizontal/vertical layout, summaries, and currency formatting. |
| `LineCharts` | Multi-series trend lines | `data: LineChartDataItem[]`; light wrapper around lazy-loaded line chart content. |
| `PieChart` | Part-to-whole relationships | `pies: PieGroup[]`; supports legends, summaries, and multi-stack views. |
| `RadarChart` | Compare dimensions across a common axis | `data: RadarGroup[]`; good for scorecards and capability comparisons. |
| `StackBarChart` | Stacked comparisons | `bars: StackBarGroup[]`; supports stacked series with per-series styling. |
| `BaseChartCard` | Shared shell for custom chart bodies | Use when you want the same header/footer/selector pattern around custom content. |
| `ChartFallback` | Suspense fallback for lazy chart bodies | Matches the chart container height. |

## Example: categorical comparison with `BarChart`

```tsx
import { BarChart, type BarChartDataItem } from "@flowui/ui/charts"

const salesByRegion: BarChartDataItem[] = [
  {
    label: "Sales by region",
    axisAccessorKey: "region",
    bars: [
      { accessorKey: "sales", label: "Sales", fill: "hsl(var(--primary))" },
    ],
    data: [
      { region: "North", sales: 120 },
      { region: "South", sales: 92 },
      { region: "West", sales: 153 },
    ],
  },
]

export function RegionSalesChart() {
  return (
    <BarChart
      bars={salesByRegion}
      layout="horizontal"
      enableTooltip
      showSummary
      headerTitle="Regional sales"
    />
  )
}
```

## Shared behaviors

- Chart bodies are lazy-loaded with `React.lazy`.
- Each chart component already wraps its lazy body in `Suspense` with `ChartFallback`, so you usually **do not** need to add your own `Suspense` boundary around normal chart usage.
- Tooltips and legends are enabled by default on several chart types.
- Header and footer slots accept either static `ReactNode` values or render functions.
- Summary blocks can be turned on with `showSummary`.
- Some charts expose option selectors for switching between multiple logical data sets.

## Import style and custom composition

```tsx
import { AreaChart, BarChart, ChartFallback } from "@flowui/ui/charts"
```

Use the named imports above for consistency. Reach for `ChartFallback` directly only when you are building your own lazy chart wrapper or a custom `BaseChartCard` composition.

## Data-shape rule of thumb

- `AreaChart` and `LineCharts` accept a `data` prop.
- `BarChart` and `StackBarChart` accept a `bars` prop.
- `PieChart` accepts a `pies` prop.
- `RadarChart` accepts a `data` prop shaped around radar groups.

For the bar family, the required shape is the clearest mental model: one group object contains an axis key, one or more metric definitions, and an array of row objects that match those accessor keys.

- Keep accessor keys stable between your series config and your data rows.
- Prefer one logical story per card. If users need to switch datasets, use the built-in option patterns instead of stacking many charts vertically.
- When numbers should read like money, use the formatting props exposed by the bar and pie chart families.
