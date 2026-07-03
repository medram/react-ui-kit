"use client"

// react-doctor-disable-next-line react-doctor/prefer-dynamic-import -- this file is itself React.lazy-loaded by its sibling wrapper; recharts is part of the lazy chunk.
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts"
import { cn } from "../lib/cn"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../primitives/chart"

export type LineChartDataItem = {
  label: string
  data: Record<string, number | string>[]
  suffix?: string
  headerTitle?: string | React.ReactNode
  headerDescription?: string | React.ReactNode
  footerDescription?: string | React.ReactNode
}

export type LineChartContentProps = {
  optionIndex: number
  data: LineChartDataItem[]
  chartConfigFromData: ChartConfig[]
  chartsKeys: string[][]
  chartContainerClassName?: string
  strokeWidth: number
  enableTooltip: boolean
  enableLegend: boolean
  legendPosition: "top" | "right" | "bottom" | "left"
}

export default function LineChartContent({
  optionIndex,
  data,
  chartConfigFromData,
  chartsKeys,
  chartContainerClassName,
  strokeWidth,
  enableTooltip,
  enableLegend,
  legendPosition,
}: LineChartContentProps) {
  return (
    <ChartContainer
      config={chartConfigFromData[optionIndex]}
      className={cn("w-full h-[200px] sm:h-[250px] lg:h-[300px]", chartContainerClassName)}
    >
      <LineChart accessibilityLayer data={data[optionIndex].data} className=" lg:p-3">
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={chartsKeys[optionIndex][0]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
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

        {chartsKeys[optionIndex].slice(1).map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={chartConfigFromData[optionIndex][key].color}
            strokeWidth={strokeWidth}
            radius={0}
            dot={{ r: 1 }}
            activeDot={{ r: 3 }}
          />
        ))}

        {enableLegend && (
          <Legend
            layout={
              legendPosition === "left" || legendPosition === "right" ? "vertical" : "horizontal"
            }
            verticalAlign={legendPosition === "top" ? "top" : "bottom"}
            align={legendPosition === "right" ? "right" : "center"}
            formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
          />
        )}
      </LineChart>
    </ChartContainer>
  )
}
