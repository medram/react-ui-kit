"use client"

import { Suspense, lazy, useMemo, type ComponentProps, type ReactElement } from "react"
import { cn } from "../lib/cn"
import type { ChartConfig } from "../primitives/chart"
import { TableCell, TableRow } from "../primitives/table"
import type { Prettify } from "../types"
import { formatCurrency } from "../utils"
import { BaseChartCard, ChartFallback } from "./BaseChartCard"
import type { StackBarChartContentProps } from "./StackBarChart.content"

const StackBarChartContent = lazy(() => import("./StackBarChart.content"))

export type StackBarSeries = {
  accessorKey: string
  label?: string
  fill?: string
  stackId?: string
}

export type StackBarGroup = {
  label: string
  axisAccessorKey: string
  axisSuffix?: string
  stackId?: string
  bars: StackBarSeries[]
  data: Record<string, number | string>[]
  suffix?: string
}

export type StackBarChartProps = Prettify<
  ComponentProps<typeof BaseChartCard<string>> & {
    bars: StackBarGroup[]
    layout?: "vertical" | "horizontal"
    enableTooltip?: boolean
    barChartClassName?: string
    showSummary?: boolean
    renderSummary?: (barData: StackBarGroup, suffix?: string) => ReactElement
    enableFormatCurrency?: boolean
    excludeZeroValues?: boolean
    contentClassName?: string
    enableLegend?: boolean
    legendPosition?: "top" | "right" | "bottom" | "left"
  }
>

export function StackBarChart({
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
  ...barChartCardProps
}: StackBarChartProps) {
  const chartConfig = bars.map((bar) => {
    return bar.bars.reduce((acc, series) => {
      acc[series.accessorKey] = {
        label: series.label || series.accessorKey,
      }
      return acc
    }, {} as ChartConfig)
  })

  const filterData = (data: Record<string, number | string>[]) => {
    if (!excludeZeroValues) return data
    return data.filter((item) =>
      bars.some((bar) =>
        bar.bars.some((series) => {
          const value = item[series.accessorKey]
          return value !== null && value !== undefined && value !== 0
        }),
      ),
    )
  }

  const renderSummary = (barData: StackBarGroup, suffix?: string) => {
    const filteredData = filterData(barData.data)
    const total = filteredData.reduce(
      (sum, item) =>
        sum +
        barData.bars.reduce(
          (seriesSum, series) => seriesSum + (item[series.accessorKey] as number),
          0,
        ),
      0,
    )

    const sortedData = filteredData.toSorted((a, b) => {
      const sumA = barData.bars.reduce((sum, series) => sum + (a[series.accessorKey] as number), 0)
      const sumB = barData.bars.reduce((sum, series) => sum + (b[series.accessorKey] as number), 0)
      return sumB - sumA
    })

    return sortedData.map((item) => (
      <TableRow key={String(item[barData.axisAccessorKey])}>
        <TableCell className="text-nowrap">
          {item[barData.axisAccessorKey]}
          {barData.axisSuffix && ` ${barData.axisSuffix}`}
        </TableCell>
        {barData.bars.map((series) => (
          <TableCell key={series.accessorKey}>
            {enableFormatCurrency
              ? formatCurrency(item[series.accessorKey] as number)
              : item[series.accessorKey]}{" "}
            {suffix}
          </TableCell>
        ))}
        <TableCell>
          {(barData.bars.reduce((sum, series) => sum + (item[series.accessorKey] as number), 0) /
            total) *
            100 >
          0
            ? (
                (barData.bars.reduce(
                  (sum, series) => sum + (item[series.accessorKey] as number),
                  0,
                ) /
                  total) *
                100
              ).toFixed(2)
            : 0}
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
      contentClassName={cn(
        contentClassName,
        "flex lg:flex-row flex-col flex-nowrap items-stretch gap-4 w-full",
      )}
    >
      {({ optionIndex }) => {
        if (optionIndex == null || !bars[optionIndex]) return null
        const contentProps: StackBarChartContentProps = {
          optionIndex,
          bars,
          chartConfig,
          layout,
          barChartClassName,
          enableTooltip,
          enableLegend,
          legendPosition,
          showSummary,
          filteredData: filterData(bars[optionIndex].data),
          renderSummary: customRenderSummary || renderSummary,
        }
        return (
          <Suspense fallback={<ChartFallback />}>
            <StackBarChartContent {...contentProps} />
          </Suspense>
        )
      }}
    </BaseChartCard>
  )
}
