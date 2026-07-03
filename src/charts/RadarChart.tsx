"use client"

import {
  Suspense,
  lazy,
  useMemo,
  type ComponentProps,
  type ComponentType,
  type ReactElement,
} from "react"
import { cn } from "../lib/cn"
import { TableCell, TableRow } from "../primitives/table"
import type { Prettify } from "../types"
import { formatCurrency } from "../utils"
import { BaseChartCard, ChartFallback } from "./BaseChartCard"
import type { RadarChartContentProps, RadarData, RadarGroup } from "./RadarChart.content"

const RadarChartContent = lazy(() => import("./RadarChart.content"))

type RadarChartProps = Prettify<
  ComponentProps<typeof BaseChartCard> & {
    data: RadarGroup[]
    multiStack?: boolean
    radarChartClassName?: string
    showLegend?: boolean
    enableTooltip?: boolean
    showSummary?: boolean
    renderSummary?: (radarData: RadarData[], suffix?: string, axisSuffix?: string) => ReactElement
    enableFormatCurrency?: boolean
  }
>

export default function RadarChart({
  data,
  showLegend = true,
  enableTooltip = true,
  radarChartClassName,
  showSummary = false,
  renderSummary: customRenderSummary,
  enableFormatCurrency = false,
  contentClassName,
  ...chartCardProps
}: RadarChartProps) {
  const chartData = useMemo(
    () =>
      data.map(({ label, data }) => ({
        label,
        data: data.map((record, index) => ({
          ...record,
          fill: record.fill || `var(--chart-${(index % 14) + 1})`,
        })),
      })),
    [data],
  )

  const chartConfig = useMemo(
    () =>
      data.map((radar) =>
        radar.data.reduce(
          (acc, record, index) => {
            acc[record.name] = {
              label: record.label || record.name,
              icon: record.icon,
              color: record.fill || `var(--chart-${(index % 14) + 1})`,
            }
            return acc
          },
          {} as Record<string, { label: string; icon?: ComponentType<{}>; color: string }>,
        ),
      ),
    [data],
  )

  const renderSummaryTable = (radarData: RadarData[], suffix?: string, axisSuffix?: string) => {
    const total = radarData.reduce((acc, curr) => acc + curr.data, 0)
    return radarData
      .toSorted((a, b) => b.data - a.data)
      .map((item) => {
        const percentage = total > 0 ? ((item.data / total) * 100).toFixed(0) : 0
        return (
          <TableRow key={item.name}>
            <TableCell>
              {item.name}
              {axisSuffix && ` ${axisSuffix}`}
            </TableCell>
            <TableCell>
              {enableFormatCurrency ? formatCurrency(item.data) : item.data} {suffix || ""}
            </TableCell>
            <TableCell>{percentage}%</TableCell>
          </TableRow>
        )
      })
  }

  const availableOptions = useMemo(
    () => data.map((radar, index) => ({ label: radar.label, value: index.toString() })),
    [data],
  )

  return (
    <BaseChartCard
      options={availableOptions}
      {...chartCardProps}
      contentClassName={cn(
        contentClassName,
        "flex lg:flex-row flex-col flex-nowrap items-stretch items-center",
      )}
      footerClassName="w-full flex flex-col items-center gap-2"
    >
      {({ optionIndex }) => {
        if (optionIndex == null || !data[optionIndex]) return null
        const contentProps: RadarChartContentProps = {
          optionIndex,
          data,
          chartConfig,
          chartData,
          radarChartClassName,
          showLegend,
          enableTooltip,
          showSummary,
          renderSummary: customRenderSummary || renderSummaryTable,
        }
        return (
          <Suspense fallback={<ChartFallback />}>
            <RadarChartContent {...contentProps} />
          </Suspense>
        )
      }}
    </BaseChartCard>
  )
}
