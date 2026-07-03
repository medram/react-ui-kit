"use client"

import { Suspense, lazy, useMemo, type ComponentProps } from "react"
import type { ChartConfig } from "../primitives/chart"
import type { Prettify } from "../types"
import type { AreaChartContentProps, AreaChartDataItem } from "./AreaChart.content"
import { BaseChartCard, ChartFallback } from "./BaseChartCard"

// Pulled out of the main bundle: recharts is heavy and only needed when an
// area chart actually mounts. React.lazy ensures it loads on demand.
const AreaChartContent = lazy(() => import("./AreaChart.content"))

type AreaChartProps = Prettify<
  Omit<
    ComponentProps<typeof BaseChartCard>,
    "headerTitle" | "headerDescription" | "footerDescription"
  > & {
    data: AreaChartDataItem[]
    chartContainerClassName?: string
    fillOpacity?: number
    enableTooltip?: boolean
    enableLegend?: boolean
    legendPosition?: "top" | "right" | "bottom" | "left"
    selectedOption?: string
    onOptionChange?: (option: string) => void
    gradientArea?: boolean
    showSummary?: boolean
    headerTitle?: React.ReactNode
    headerDescription?: React.ReactNode
    footerDescription?: React.ReactNode
  }
>

export default function AreaChart({
  data,
  chartContainerClassName,
  fillOpacity = 0.3,
  enableTooltip = true,
  enableLegend = true,
  legendPosition = "bottom",
  gradientArea = false,
  showSummary = false,
  headerTitle: staticHeaderTitle,
  headerDescription: staticHeaderDescription,
  footerDescription: staticFooterDescription,
  ...baseChartCardProps
}: AreaChartProps) {
  const chartsKeys = useMemo(() => data.map((chart) => Object.keys(chart.data[0] || {})), [data])

  const chartConfigFromData = useMemo(
    () =>
      chartsKeys.map((keys) =>
        keys?.reduce((acc, key) => {
          acc[key] = {
            label: key.charAt(0).toUpperCase() + key.slice(1),
            color: `var(--chart-${keys.indexOf(key) + 1})`,
          }
          return acc
        }, {} as ChartConfig),
      ),
    [chartsKeys],
  )

  const availableOptions = useMemo(
    () => data.map((chart, index) => ({ label: chart.label, value: index.toString() })),
    [data],
  )

  const sortedKeys = useMemo(() => {
    return chartsKeys.map((keys, dataIndex) => {
      const lastDataPoint = data[dataIndex].data[data[dataIndex].data.length - 1]
      return keys.slice(1).toSorted((a, b) => {
        const valueA = Number(lastDataPoint[a]) || 0
        const valueB = Number(lastDataPoint[b]) || 0
        return valueA - valueB
      })
    })
  }, [chartsKeys, data])

  return (
    <BaseChartCard
      options={availableOptions}
      {...baseChartCardProps}
      headerTitle={({ optionIndex }) =>
        (optionIndex != null ? data[optionIndex]?.headerTitle : undefined) || staticHeaderTitle
      }
      headerDescription={({ optionIndex }) =>
        (optionIndex != null ? data[optionIndex]?.headerDescription : undefined) ||
        staticHeaderDescription
      }
      footerDescription={({ optionIndex }) =>
        (optionIndex != null ? data[optionIndex]?.footerDescription : undefined) ||
        staticFooterDescription
      }
    >
      {({ optionIndex }) => {
        if (optionIndex == null || !data[optionIndex]) return null
        const contentProps: AreaChartContentProps = {
          optionIndex,
          data,
          chartConfigFromData,
          sortedKeys,
          chartsKeys,
          enableTooltip,
          enableLegend,
          legendPosition,
          gradientArea,
          showSummary,
          chartContainerClassName,
          fillOpacity,
        }
        return (
          <Suspense fallback={<ChartFallback />}>
            <AreaChartContent {...contentProps} />
          </Suspense>
        )
      }}
    </BaseChartCard>
  )
}
