"use client"

import { Suspense, lazy, useMemo, type ComponentProps, type ReactElement } from "react"
import { cn } from "../lib/cn"
import type { ChartConfig } from "../primitives/chart"
import { TableCell, TableRow } from "../primitives/table"
import type { Prettify } from "../types"
import { formatCurrency } from "../utils"
import type { BarChartContentProps } from "./BarChart.content"
import { BaseChartCard, ChartFallback } from "./BaseChartCard"

const BarChartContent = lazy(() => import("./BarChart.content"))

function formatXAxisTick(tick: string) {
  return tick.length > 18 ? `${tick.slice(0, 18)}...` : tick
}

export type BarChartDataItem = {
  label: string
  axisAccessorKey: string
  axisSuffix?: string
  bars: {
    accessorKey: string
    label?: string
    fill?: string
  }[]
  data: Record<string, number | string>[]
  suffix?: string
  headerTitle?: string | React.ReactNode
  headerDescription?: string | React.ReactNode
  footerDescription?: string | React.ReactNode
}

export type BarChartProps = Prettify<
  Omit<
    ComponentProps<typeof BaseChartCard<string>>,
    "headerTitle" | "headerDescription" | "footerDescription"
  > & {
    bars: BarChartDataItem[]
    layout?: "vertical" | "horizontal"
    enableTooltip?: boolean
    barChartClassName?: string
    showSummary?: boolean
    renderSummary?: (barData: BarChartDataItem, suffix?: string) => ReactElement
    enableFormatCurrency?: boolean
    excludeZeroValues?: boolean
    enableLegend?: boolean
    legendPosition?: "top" | "right" | "bottom" | "left"
    headerTitle?: React.ReactNode
    headerDescription?: React.ReactNode
    footerDescription?: React.ReactNode
  }
>

export function BarChart({
  bars,
  layout = "horizontal",
  barChartClassName,
  enableTooltip = true,
  showSummary = false,
  renderSummary: customRenderSummary,
  enableFormatCurrency = false,
  contentClassName = "",
  excludeZeroValues = false,
  enableLegend = false,
  legendPosition = "top",
  headerTitle: staticHeaderTitle,
  headerDescription: staticHeaderDescription,
  footerDescription: staticFooterDescription,
  ...barChartCardProps
}: BarChartProps) {
  const chartConfig = bars.map((bar) => {
    return bar.bars.reduce((acc, bar) => {
      acc[bar.accessorKey] = {
        label: bar.label || bar.accessorKey,
      }
      return acc
    }, {} as ChartConfig)
  })

  const filterData = (data: Record<string, number | string>[]) => {
    if (!excludeZeroValues) return data
    return data.filter((item) =>
      bars.some((bar) =>
        bar.bars.some((b) => {
          const value = item[b.accessorKey]
          return value !== null && value !== undefined && value !== 0
        }),
      ),
    )
  }

  const renderSummary = (barData: BarChartDataItem, suffix?: string) => {
    const filteredData = filterData(barData.data)

    const total = filteredData.reduce(
      (sum, item) =>
        sum + barData.bars.reduce((barSum, bar) => barSum + (item[bar.accessorKey] as number), 0),
      0,
    )

    const sortedData = filteredData.toSorted((a, b) => {
      const sumA = barData.bars.reduce((sum, bar) => sum + (a[bar.accessorKey] as number), 0)
      const sumB = barData.bars.reduce((sum, bar) => sum + (b[bar.accessorKey] as number), 0)
      return sumB - sumA
    })

    return sortedData.map((item) => (
      <TableRow key={String(item[barData.axisAccessorKey])}>
        <TableCell className="text-nowrap">
          {item[barData.axisAccessorKey]}
          {barData.axisSuffix && ` ${barData.axisSuffix}`}
        </TableCell>
        {barData.bars.map((bar) => (
          <TableCell key={bar.accessorKey}>
            {enableFormatCurrency
              ? formatCurrency(item[bar.accessorKey] as number)
              : item[bar.accessorKey]}{" "}
            {suffix}
          </TableCell>
        ))}
        <TableCell>
          {(
            (barData.bars.reduce((sum, bar) => sum + (item[bar.accessorKey] as number), 0) /
              total) *
            100
          ).toFixed(2)}
          %
        </TableCell>
      </TableRow>
    ))
  }

  const availableOptions = useMemo(
    () => bars.map((bar, index) => ({ label: bar.label, value: index.toString() })),
    [bars],
  )

  return (
    <BaseChartCard
      options={availableOptions}
      {...barChartCardProps}
      contentClassName={cn(contentClassName, "flex lg:flex-row flex-col flex-nowrap gap-4 w-full")}
      headerTitle={({ optionIndex }) =>
        (optionIndex != null ? bars[optionIndex]?.headerTitle : undefined) || staticHeaderTitle
      }
      headerDescription={({ optionIndex }) =>
        (optionIndex != null ? bars[optionIndex]?.headerDescription : undefined) ||
        staticHeaderDescription
      }
      footerDescription={({ optionIndex }) =>
        (optionIndex != null ? bars[optionIndex]?.footerDescription : undefined) ||
        staticFooterDescription
      }
    >
      {({ optionIndex }) => {
        if (optionIndex == null || !bars[optionIndex]) return null
        const contentProps: BarChartContentProps = {
          optionIndex,
          bars,
          chartConfig,
          layout,
          barChartClassName,
          enableTooltip,
          enableLegend,
          legendPosition,
          showSummary,
          enableFormatCurrency,
          filterData,
          renderSummary: customRenderSummary || renderSummary,
          formatXAxisTick,
        }
        return (
          <Suspense fallback={<ChartFallback />}>
            <BarChartContent {...contentProps} />
          </Suspense>
        )
      }}
    </BaseChartCard>
  )
}
