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
import type { BarChartDataItem } from "./BarChart"

export type BarChartContentProps = {
  optionIndex: number
  bars: BarChartDataItem[]
  chartConfig: ChartConfig[]
  layout: "vertical" | "horizontal"
  barChartClassName?: string
  enableTooltip: boolean
  enableLegend: boolean
  legendPosition: "top" | "right" | "bottom" | "left"
  showSummary: boolean
  enableFormatCurrency: boolean
  filterData: (data: Record<string, number | string>[]) => Record<string, number | string>[]
  renderSummary: (barData: BarChartDataItem, suffix?: string) => ReactElement | ReactElement[]
  formatXAxisTick: (tick: string) => string
}

function BarSummary({
  render,
  args,
}: {
  render: BarChartContentProps["renderSummary"]
  args: Parameters<BarChartContentProps["renderSummary"]>
}) {
  return <>{render(...args)}</>
}

export default function BarChartContent({
  optionIndex,
  bars,
  chartConfig,
  layout,
  barChartClassName,
  enableTooltip,
  enableLegend,
  legendPosition,
  showSummary,
  filterData,
  renderSummary,
  formatXAxisTick,
}: BarChartContentProps) {
  const filteredData = filterData(bars[optionIndex].data)

  return (
    <>
      <div className={cn("flex-1 min-w-0", showSummary ? "lg:w-2/3" : "w-full")}>
        <ChartContainer
          config={chartConfig[optionIndex]}
          className={cn("h-[350px] w-full", barChartClassName)}
        >
          {layout === "horizontal" ? (
            <RechartsBarChart
              width={100}
              height={100}
              data={filteredData}
              accessibilityLayer
              style={{ width: "100%", height: "100%" }}
            >
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

              {enableLegend && (
                <Legend
                  layout={
                    legendPosition === "left" || legendPosition === "right"
                      ? "vertical"
                      : "horizontal"
                  }
                  verticalAlign={legendPosition === "top" ? "top" : "bottom"}
                  align={legendPosition === "right" ? "right" : "center"}
                  formatter={(value) => value}
                  wrapperStyle={{
                    paddingBottom: "15px",
                  }}
                />
              )}
              {bars[optionIndex].bars.map((bar, index) => (
                <Bar
                  key={bar.accessorKey}
                  dataKey={bar.accessorKey}
                  name={bar.label || bar.accessorKey}
                  fill={bar.fill || `var(--chart-${(index % 5) + 1})`}
                  radius={2}
                  maxBarSize={50}
                />
              ))}
            </RechartsBarChart>
          ) : (
            <RechartsBarChart
              width={100}
              height={100}
              data={filteredData}
              layout="vertical"
              accessibilityLayer
              style={{ width: "100%", height: "100%" }}
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
                        const bar = bars[optionIndex]
                        const suffix = bar.suffix ? ` ${bar.suffix}` : ""
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
              {enableLegend && (
                <Legend
                  layout={
                    legendPosition === "left" || legendPosition === "right"
                      ? "vertical"
                      : "horizontal"
                  }
                  verticalAlign={legendPosition === "top" ? "top" : "bottom"}
                  align={legendPosition === "right" ? "right" : "center"}
                  formatter={(value) => value}
                />
              )}
              {bars[optionIndex].bars.map((bar, index) => (
                <Bar
                  key={bar.accessorKey}
                  dataKey={bar.accessorKey}
                  fill={bar.fill || `var(--chart-${(index % 14) + 1})`}
                  radius={8}
                />
              ))}
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
              <div className="h-[270px] overflow-x-auto">
                <Table className="border-none">
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      {bars[optionIndex]?.bars.map((bar) => (
                        <TableHead key={bar.accessorKey} className="text-nowrap">
                          {bar.label || bar.accessorKey.split("_").join(" ")}
                        </TableHead>
                      ))}
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <BarSummary
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
