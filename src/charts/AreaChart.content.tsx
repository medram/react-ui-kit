"use client"

// react-doctor-disable-next-line react-doctor/prefer-dynamic-import -- this file is itself React.lazy-loaded by its sibling wrapper; recharts is part of the lazy chunk.
import { Area, CartesianGrid, Legend, AreaChart as RechartsAreaChart, XAxis, YAxis } from "recharts"
import { cn } from "../lib/cn"
import { Card, CardContent, CardHeader, CardTitle } from "../primitives/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../primitives/chart"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../primitives/table"

export type AreaChartDataItem = {
  label: string
  axisSuffix?: string
  data: Record<string, number | string>[]
  suffix?: string
  headerTitle?: string | React.ReactNode
  headerDescription?: string | React.ReactNode
  footerDescription?: string | React.ReactNode
}

export type AreaChartContentProps = {
  optionIndex: number
  data: AreaChartDataItem[]
  chartConfigFromData: ChartConfig[]
  sortedKeys: string[][]
  chartsKeys: string[][]
  enableTooltip: boolean
  enableLegend: boolean
  legendPosition: "top" | "right" | "bottom" | "left"
  gradientArea: boolean
  showSummary: boolean
  chartContainerClassName?: string
  fillOpacity: number
}

export default function AreaChartContent({
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
}: AreaChartContentProps) {
  return (
    <div className={cn("flex lg:flex-row flex-col flex-nowrap items-stretch gap-4 w-full")}>
      <div className="flex-1 min-w-0">
        <ChartContainer
          config={chartConfigFromData[optionIndex]}
          className={cn(
            "h-[350px] w-full",
            showSummary ? "lg:w-2/3" : "w-full",
            chartContainerClassName,
          )}
        >
          <RechartsAreaChart accessibilityLayer data={data[optionIndex].data} className="lg:p-3">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={chartsKeys[optionIndex][0]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const formatted = value.toString()
                return data[optionIndex].axisSuffix
                  ? `${formatted} ${data[optionIndex].axisSuffix}`
                  : formatted
              }}
            />
            <YAxis domain={["dataMin", "dataMax+2"]} />
            {enableTooltip && (
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel={false}
                    className="w-fit"
                    labelClassName="px-2"
                    formatter={(value, name) => {
                      const selectedData = data[optionIndex]
                      const suffix = selectedData.suffix ? ` ${selectedData.suffix}` : ""
                      const color = chartConfigFromData[optionIndex][name]?.color || "black"
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

            {gradientArea && (
              <defs>
                {sortedKeys[optionIndex].map((key) => (
                  <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={chartConfigFromData[optionIndex][key].color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartConfigFromData[optionIndex][key].color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
            )}

            {sortedKeys[optionIndex].map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="monotone"
                stroke={chartConfigFromData[optionIndex][key].color}
                fill={
                  gradientArea
                    ? `url(#gradient-${key})`
                    : chartConfigFromData[optionIndex][key].color
                }
                fillOpacity={fillOpacity}
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
          </RechartsAreaChart>
        </ChartContainer>
      </div>
      {showSummary && (
        <Card className="w-full lg:w-1/3 shadow-none border-none lg:border-l lg:border-gray-300 bg-transparent">
          <CardHeader className="px-1">
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="h-[270px]" style={{ overflowX: "auto" }}>
              <Table className="border-none">
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    {sortedKeys[optionIndex].map((key) => (
                      <TableHead key={key} className="text-nowrap">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </TableHead>
                    ))}
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{/* ... table body content ... */}</TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
