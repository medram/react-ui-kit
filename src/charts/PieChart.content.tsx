"use client"

import { type ComponentType, type ReactElement } from "react"
// react-doctor-disable-next-line react-doctor/prefer-dynamic-import -- this file is itself React.lazy-loaded by its sibling wrapper; recharts is part of the lazy chunk.
import { PieChart as CPieChart, Cell, Pie } from "recharts"
import { cn } from "../lib/cn"
import { Card, CardContent, CardHeader, CardTitle } from "../primitives/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../primitives/chart"
import { Separator } from "../primitives/separator"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../primitives/table"

export type PieData = {
  name: string
  data: number
  label?: string
  icon?: ComponentType<{}>
  fill?: string
}

export type PieGroup = {
  label: string
  axisSuffix?: string
  suffix?: string
  data: PieData[]
  headerTitle?: string | React.ReactNode
  headerDescription?: string | React.ReactNode
  footerDescription?: string | React.ReactNode
}

export type PieChartContentProps = {
  optionIndex: number
  pies: PieGroup[]
  chartConfig: Record<string, { label: string; icon?: ComponentType<{}>; color: string }>[]
  chartData: { label: string; data: (PieData & { fill: string })[] }[]
  pieChartClassName?: string
  showSummary: boolean
  showLegend: boolean
  enableTooltip: boolean
  renderSummary: (
    data: PieData[],
    suffix?: string,
    axisSuffix?: string,
  ) => ReactElement | ReactElement[]
}

function PieSummary({
  render,
  args,
}: {
  render: PieChartContentProps["renderSummary"]
  args: Parameters<PieChartContentProps["renderSummary"]>
}) {
  return <>{render(...args)}</>
}

function CustomPieLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}) {
  if (percent === 0) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontWeight: 700 }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function PieChartContent({
  optionIndex,
  pies,
  chartConfig,
  chartData,
  pieChartClassName,
  showSummary,
  showLegend,
  enableTooltip,
  renderSummary,
}: PieChartContentProps) {
  return (
    <>
      <div className="flex-1 min-w-0">
        <ChartContainer
          config={chartConfig[optionIndex]}
          className={cn("h-[350px] w-full", showSummary ? "lg:w-2/3" : "w-full", pieChartClassName)}
        >
          <CPieChart>
            {enableTooltip && (
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel={false}
                    className="w-fit"
                    labelClassName="px-2"
                    formatter={(value, name) => {
                      const pie = pies[optionIndex]
                      const suffix = pie.suffix ? ` ${pie.suffix}` : ""
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
            <Pie
              data={chartData[optionIndex]?.data}
              dataKey="data"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              labelLine={false}
              label={CustomPieLabel}
            >
              {chartData[optionIndex]?.data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            {showLegend && (
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="flex flex-wrap justify-center"
              />
            )}
          </CPieChart>
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
              <div className="max-h-[270px]" style={{ overflowX: "auto" }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>{pies[optionIndex]?.label}</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <PieSummary
                      render={renderSummary}
                      args={[
                        chartData[optionIndex]?.data,
                        pies[optionIndex]?.suffix,
                        pies[optionIndex]?.axisSuffix,
                      ]}
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
