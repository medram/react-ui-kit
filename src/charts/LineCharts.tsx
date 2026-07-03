"use client"

import { Suspense, lazy, useMemo, type ComponentProps } from "react"
import type { ChartConfig } from "../primitives/chart"
import type { Prettify } from "../types"
import { BaseChartCard, ChartFallback } from "./BaseChartCard"
import type { LineChartContentProps, LineChartDataItem } from "./LineCharts.content"

const LineChartContent = lazy(() => import("./LineCharts.content"))

type LineChartProps = Prettify<
  Omit<
    ComponentProps<typeof BaseChartCard>,
    "headerTitle" | "headerDescription" | "footerDescription"
  > & {
    data: LineChartDataItem[]
    chartContainerClassName?: string
    strokeWidth?: number
    enableTooltip?: boolean
    enableLegend?: boolean
    legendPosition?: "top" | "right" | "bottom" | "left"
    selectedOption?: string
    onOptionChange?: (option: string) => void
    headerTitle?: React.ReactNode
    headerDescription?: React.ReactNode
    footerDescription?: React.ReactNode
  }
>

export function LineCharts({
  data,
  chartContainerClassName,
  strokeWidth = 2,
  enableTooltip = true,
  enableLegend = true,
  legendPosition = "bottom",
  selectedOption,
  onOptionChange,
  headerTitle: staticHeaderTitle,
  headerDescription: staticHeaderDescription,
  footerDescription: staticFooterDescription,
  ...baseChartCardProps
}: LineChartProps) {
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
        const contentProps: LineChartContentProps = {
          optionIndex,
          data,
          chartConfigFromData,
          chartsKeys,
          chartContainerClassName,
          strokeWidth,
          enableTooltip,
          enableLegend,
          legendPosition,
        }
        return (
          <Suspense fallback={<ChartFallback className="h-[200px] sm:h-[250px] lg:h-[300px]" />}>
            <LineChartContent {...contentProps} />
          </Suspense>
        )
      }}
    </BaseChartCard>
  )
}
