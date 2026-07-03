"use client"

import { type ComponentType, type ReactElement } from "react"
// react-doctor-disable-next-line react-doctor/prefer-dynamic-import -- this file is itself React.lazy-loaded by its sibling wrapper; recharts is part of the lazy chunk.
import {
  RadarChart as CRadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
} from "recharts"
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

export type RadarData = {
  name: string
  data: number
  label?: string
  icon?: ComponentType<{}>
  fill?: string
}

export type RadarGroup = {
  label: string
  axisSuffix?: string
  suffix?: string
  data: RadarData[]
}

export type RadarChartContentProps = {
  optionIndex: number
  data: RadarGroup[]
  chartConfig: Record<string, { label: string; icon?: ComponentType<{}>; color: string }>[]
  chartData: { label: string; data: (RadarData & { fill: string })[] }[]
  radarChartClassName?: string
  showLegend: boolean
  enableTooltip: boolean
  showSummary: boolean
  renderSummary: (
    radarData: RadarData[],
    suffix?: string,
    axisSuffix?: string,
  ) => ReactElement | ReactElement[]
}

function RadarSummary({
  render,
  args,
}: {
  render: RadarChartContentProps["renderSummary"]
  args: Parameters<RadarChartContentProps["renderSummary"]>
}) {
  return <>{render(...args)}</>
}

export default function RadarChartContent({
  optionIndex,
  data,
  chartConfig,
  chartData,
  radarChartClassName,
  showLegend,
  enableTooltip,
  showSummary,
  renderSummary,
}: RadarChartContentProps) {
  return (
    <>
      <ChartContainer
        config={chartConfig[optionIndex]}
        className={cn("aspect-square h-[350px] overflow-x-hidden", radarChartClassName)}
      >
        <CRadarChart width={350} height={350} data={chartData[optionIndex]?.data}>
          {enableTooltip && (
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel={false}
                  className="w-fit"
                  labelClassName="px-2"
                  formatter={(value, name) => {
                    const radar = data[optionIndex]
                    const suffix = radar.suffix ? ` ${radar.suffix}` : ""
                    const color = chartConfig[optionIndex][name]?.color || "black"
                    return (
                      <span>
                        <span style={{ color }}>{""}</span> {name} : {value}
                        {suffix}
                      </span>
                    )
                  }}
                />
              }
            />
          )}
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis />
          <Radar
            name={chartData[optionIndex]?.label}
            dataKey="data"
            stroke={`var(--chart-${(optionIndex % 14) + 1})`}
            fill={`var(--chart-${(optionIndex % 14) + 1})`}
            fillOpacity={0.6}
          />
          {showLegend && (
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="flex flex-wrap justify-center"
            />
          )}
        </CRadarChart>
      </ChartContainer>
      {showSummary && (
        <>
          <Separator className="w-full lg:hidden" />
          <Separator className="hidden lg:block" orientation="vertical" />
          <Card className="w-full max-w-md shadow-none lg:mt-0 lg:flex-1 border-none lg:border-l lg:border-gray-300 lg:pl-4 ">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[270px]" style={{ overflowX: "auto" }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>{data[optionIndex]?.label}</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <RadarSummary
                      render={renderSummary}
                      args={[
                        chartData[optionIndex]?.data,
                        data[optionIndex]?.suffix,
                        data[optionIndex]?.axisSuffix,
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
