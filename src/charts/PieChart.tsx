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
import type { PieChartContentProps, PieData, PieGroup } from "./PieChart.content"

const PieChartContent = lazy(() => import("./PieChart.content"))

type PieChartProps = Prettify<
  Omit<
    ComponentProps<typeof BaseChartCard>,
    "headerTitle" | "headerDescription" | "footerDescription"
  > & {
    pies: PieGroup[]
    multiStack?: boolean
    pieChartClassName?: string
    showLegend?: boolean
    enableTooltip?: boolean
    showSummary?: boolean
    renderSummary?: (pieData: PieData[], suffix?: string, axisSuffix?: string) => ReactElement
    enableFormatCurrency?: boolean
    headerTitle?: React.ReactNode
    headerDescription?: React.ReactNode
    footerDescription?: React.ReactNode
  }
>

export default function PieChart({
  pies,
  showLegend = true,
  enableTooltip = true,
  pieChartClassName,
  showSummary = false,
  renderSummary: customRenderSummary,
  enableFormatCurrency = false,
  contentClassName,
  headerTitle: staticHeaderTitle,
  headerDescription: staticHeaderDescription,
  footerDescription: staticFooterDescription,
  ...barChartCardProps
}: PieChartProps) {
  const chartData = useMemo(
    () =>
      pies.map(({ label, data }) => ({
        label,
        data: data.map((record, index) => ({
          ...record,
          fill: record.fill || `var(--chart-${(index % 14) + 1})`,
        })),
      })),
    [pies],
  )

  const chartConfig = useMemo(
    () =>
      pies.map((pie) =>
        pie.data.reduce(
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
    [pies],
  )

  const renderSummaryTable = (pieData: PieData[], suffix?: string, axisSuffix?: string) => {
    const total = pieData.reduce((acc, curr) => acc + curr.data, 0)
    return pieData
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
    () => pies.map((pie, index) => ({ label: pie.label, value: index.toString() })),
    [pies],
  )

  return (
    <BaseChartCard
      options={availableOptions}
      {...barChartCardProps}
      contentClassName={cn(
        contentClassName,
        "flex lg:flex-row flex-col flex-nowrap items-stretch gap-4 w-full",
      )}
      footerClassName="w-full flex flex-col items-center gap-2"
      headerTitle={({ optionIndex }) =>
        (optionIndex != null ? pies[optionIndex]?.headerTitle : undefined) || staticHeaderTitle
      }
      headerDescription={({ optionIndex }) =>
        (optionIndex != null ? pies[optionIndex]?.headerDescription : undefined) ||
        staticHeaderDescription
      }
      footerDescription={({ optionIndex }) =>
        (optionIndex != null ? pies[optionIndex]?.footerDescription : undefined) ||
        staticFooterDescription
      }
    >
      {({ optionIndex }) => {
        if (optionIndex == null || !pies[optionIndex]) return null
        const contentProps: PieChartContentProps = {
          optionIndex,
          pies,
          chartConfig,
          chartData,
          pieChartClassName,
          showSummary,
          showLegend,
          enableTooltip,
          renderSummary: customRenderSummary || renderSummaryTable,
        }
        return (
          <Suspense fallback={<ChartFallback />}>
            <PieChartContent {...contentProps} />
          </Suspense>
        )
      }}
    </BaseChartCard>
  )
}
