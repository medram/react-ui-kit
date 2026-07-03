"use client"

import { type ReactElement } from "react"
// react-doctor-disable-next-line react-doctor/prefer-dynamic-import -- this file is itself React.lazy-loaded by its sibling wrapper; recharts is part of the lazy chunk.
import { Bar, CartesianGrid, Legend, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts"
import { cn } from "../lib/cn"
import { Card, CardContent, CardHeader, CardTitle } from "../primitives/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../primitives/chart"
import { Separator } from "../primitives/separator"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../primitives/table"
import type { StackBarGroup } from "./StackBarChart"

function formatXAxisTick(tick: string) {
  return tick.length > 18 ? `${tick.slice(0, 18)}...` : tick
}

export type StackBarChartContentProps = {
  optionIndex: number
  bars: StackBarGroup[]
  chartConfig: ChartConfig[]
  layout: "vertical" | "horizontal"
  barChartClassName?: string
  enableTooltip: boolean
  enableLegend: boolean
  legendPosition: "top" | "right" | "bottom" | "left"
  showSummary: boolean
  filteredData: Record<string, number | string>[]
  renderSummary: (barData: StackBarGroup, suffix?: string) => ReactElement | ReactElement[]
}

function StackBarSummary({
  render,
  args,
}: {
  render: StackBarChartContentProps["renderSummary"]
  args: Parameters<StackBarChartContentProps["renderSummary"]>
}) {
  return <>{render(...args)}</>
}

export default function StackBarChartContent({
  optionIndex,
  bars,
  chartConfig,
  layout,
  barChartClassName,
  enableTooltip,
  enableLegend,
  legendPosition,
  showSummary,
  filteredData,
  renderSummary,
}: StackBarChartContentProps) {
  return (
    <>
      <div className="flex-1 min-w-0 overflow-x-auto">
        <ChartContainer
          config={chartConfig[optionIndex]}
          className={cn(
            "h-[350px] !w-full",
            showSummary ? "lg:w-2/3" : "w-full",
            barChartClassName,
          )}
        >
          {layout === "horizontal" ? (
            <RechartsBarChart accessibilityLayer data={filteredData} className="p-1 lg:p-3">
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={bars[optionIndex].axisAccessorKey}
                tickLine={true}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const formatted = formatXAxisTick(value.toString())
                  return bars[optionIndex].axisSuffix
                    ? `${formatted} ${bars[optionIndex].axisSuffix}`
                    : formatted
                }}
              />
              <YAxis />
              {enableTooltip && (
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent hideLabel={false} className="w-48" labelClassName="px-2" />
                  }
                />
              )}
              {bars[optionIndex].bars.map((series, index) => (
                <Bar
                  key={series.accessorKey}
                  dataKey={series.accessorKey}
                  fill={series.fill || `var(--chart-${(index % 5) + 1})`}
                  stackId={series.stackId || bars[optionIndex].stackId || "stack"}
                  radius={2}
                  maxBarSize={50}
                />
              ))}
              {enableLegend && (
                <Legend
                  layout={
                    legendPosition === "left" || legendPosition === "right"
                      ? "vertical"
                      : "horizontal"
                  }
                  verticalAlign={legendPosition === "top" ? "top" : "bottom"}
                  align={legendPosition === "right" ? "right" : "center"}
                  formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                  wrapperStyle={{
                    paddingBottom: "15px",
                  }}
                />
              )}
            </RechartsBarChart>
          ) : (
            <RechartsBarChart
              accessibilityLayer
              data={filteredData}
              layout="vertical"
              className="p-1 lg:p-3"
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" />
              <YAxis
                dataKey={bars[optionIndex].axisAccessorKey}
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={120}
              />
              {enableTooltip && (
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel={false}
                      className="w-fit"
                      labelClassName="px-2"
                      formatter={(value, name) => {
                        const barGroup = bars[optionIndex]
                        const suffix = barGroup.suffix ? ` ${barGroup.suffix}` : ""
                        const color = chartConfig[optionIndex][name]?.color || "black"
                        return (
                          <span>
                            <span style={{ color }}>{"\u25CF"}</span> {name} : {value}
                            {suffix}
                          </span>
                        )
                      }}
                    />
                  }
                />
              )}
              {bars[optionIndex].bars.map((series, index) => (
                <Bar
                  key={series.accessorKey}
                  dataKey={series.accessorKey}
                  fill={series.fill || `var(--chart-${(index % 14) + 1})`}
                  stackId={series.stackId || bars[optionIndex].stackId || "stack"}
                  radius={8}
                  maxBarSize={50}
                />
              ))}
              {enableLegend && (
                <Legend
                  layout={
                    legendPosition === "left" || legendPosition === "right"
                      ? "vertical"
                      : "horizontal"
                  }
                  verticalAlign={legendPosition === "top" ? "top" : "bottom"}
                  align={legendPosition === "right" ? "right" : "center"}
                  formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
              )}
            </RechartsBarChart>
          )}
        </ChartContainer>
      </div>

      {showSummary && (
        <>
          <Separator className="w-full lg:hidden" />
          <Separator className="hidden lg:block" orientation="vertical" />
          <Card className="w-full lg:w-1/3 shadow-none border-none lg:border-l lg:border-gray-300 bg-transparent mx-4">
            <CardHeader className="px-1">
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="h-[270px]" style={{ overflowX: "auto" }}>
                <Table className="border-none">
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      {bars[optionIndex]?.bars.map((series) => (
                        <TableHead key={series.accessorKey} className="text-nowrap">
                          {series.label || series.accessorKey.split("_").join(" ")}
                        </TableHead>
                      ))}
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <StackBarSummary
                      render={renderSummary}
                      args={[bars[optionIndex], bars[optionIndex]?.suffix]}
                    />
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}
