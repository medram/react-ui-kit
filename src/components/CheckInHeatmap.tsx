"use client"

import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { cn } from "../lib/cn"
import { Tooltip, TooltipContent, TooltipTrigger } from "../primitives/tooltip"
import { CheckInDto } from "../types"

dayjs.extend(isoWeek)

type CheckInHeatmapProps = {
  checkIns: CheckInDto[]
  /**
   * Number of weeks to display (default: 53 — roughly 1 year)
   */
  weeks?: number
  className?: string
  title?: string
}

type DayCell = {
  date: dayjs.Dayjs
  count: number
  isFuture: boolean
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const DAY_LABEL_WIDTH = 28 // px — matches w-7
const CELL_GAP = 3 // px between cells

function getIntensityClass(count: number): string {
  if (count === 0) return "bg-muted hover:bg-muted/80"
  if (count === 1) return "bg-emerald-200 dark:bg-emerald-900 hover:opacity-80"
  if (count === 2) return "bg-emerald-400 dark:bg-emerald-700 hover:opacity-80"
  if (count <= 4) return "bg-emerald-500 dark:bg-emerald-600 hover:opacity-80"
  return "bg-emerald-700 dark:bg-emerald-400 hover:opacity-80"
}

export default function CheckInHeatmap({
  checkIns,
  weeks = 53,
  className,
  title,
}: CheckInHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    setContainerWidth(el.getBoundingClientRect().width)
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Compute cell size to fill the available width exactly
  const cellSize = useMemo(() => {
    if (containerWidth === 0) return 12
    const availableWidth = containerWidth - DAY_LABEL_WIDTH - CELL_GAP
    const size = Math.floor((availableWidth - (weeks - 1) * CELL_GAP) / weeks)
    return Math.max(4, size)
  }, [containerWidth, weeks])

  const { grid, months, totalCheckIns } = useMemo(() => {
    const countMap: Record<string, number> = {}
    for (const c of checkIns) {
      const dateKey = dayjs(c.check_in_time).format("YYYY-MM-DD")
      countMap[dateKey] = (countMap[dateKey] ?? 0) + 1
    }

    const today = dayjs()
    const endOfGrid = today.endOf("isoWeek")
    const startOfGrid = endOfGrid.subtract(weeks * 7 - 1, "day").startOf("day")

    const columns: DayCell[][] = []
    const monthLabels: { label: string; colIndex: number }[] = []
    const seenMonths = new Set<string>()

    for (let w = 0; w < weeks; w++) {
      const weekCells: DayCell[] = []
      for (let d = 0; d < 7; d++) {
        const date = startOfGrid.add(w * 7 + d, "day")
        const dateKey = date.format("YYYY-MM-DD")
        const monthKey = date.format("YYYY-MM")
        if (!seenMonths.has(monthKey)) {
          seenMonths.add(monthKey)
          monthLabels.push({ label: date.format("MMM"), colIndex: w })
        }
        weekCells.push({
          date,
          count: countMap[dateKey] ?? 0,
          isFuture: date.isAfter(today, "day"),
        })
      }
      columns.push(weekCells)
    }

    return { grid: columns, months: monthLabels, totalCheckIns: checkIns.length }
  }, [checkIns, weeks])

  const cellStyle = { width: cellSize, height: cellSize }

  return (
    <div ref={containerRef} className={cn("flex w-full flex-col gap-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        {title && <p className="text-sm font-medium text-foreground">{title}</p>}
        <p className="text-xs text-muted-foreground ml-auto">
          {totalCheckIns} check-in{totalCheckIns !== 1 ? "s" : ""} in the displayed period
        </p>
      </div>

      {/* Heatmap grid */}
      <div className="flex w-full flex-row" style={{ gap: CELL_GAP }}>
        {/* Day-of-week labels */}
        <div className="flex shrink-0 flex-col" style={{ width: DAY_LABEL_WIDTH, gap: CELL_GAP }}>
          {DAYS_OF_WEEK.map((day, i) => (
            <div
              key={day}
              className={cn(
                "flex items-center text-[10px] leading-none text-muted-foreground",
                i % 2 === 0 ? "opacity-0" : "opacity-100",
              )}
              style={cellStyle}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Week columns + month labels */}
        <div className="flex min-w-0 flex-1 flex-col" style={{ gap: CELL_GAP }}>
          {/* Month labels row */}
          <div className="flex flex-row" style={{ gap: CELL_GAP }}>
            {grid.map((_, colIdx) => {
              const label = months.find((m) => m.colIndex === colIdx)
              return (
                <div
                  key={colIdx}
                  className="shrink-0 overflow-hidden text-[10px] leading-none text-muted-foreground"
                  style={{ width: cellSize }}
                >
                  {label ? label.label : ""}
                </div>
              )
            })}
          </div>

          {/* Cells: render row-by-row (7 rows × weeks cols) */}
          {DAYS_OF_WEEK.map((_, dayIdx) => (
            <div key={dayIdx} className="flex flex-row" style={{ gap: CELL_GAP }}>
              {grid.map((weekCells, colIdx) => {
                const cell = weekCells[dayIdx]
                const dateStr = cell.date.format("ddd, MMM D, YYYY")
                const label =
                  cell.count === 0
                    ? `No check-ins on ${dateStr}`
                    : `${cell.count} check-in${cell.count !== 1 ? "s" : ""} on ${dateStr}`
                return (
                  <Tooltip key={colIdx} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "shrink-0 cursor-default rounded-[2px] transition-opacity",
                          cell.isFuture
                            ? "pointer-events-none opacity-0"
                            : getIntensityClass(cell.count),
                        )}
                        style={cellStyle}
                      />
                    </TooltipTrigger>
                    {!cell.isFuture && (
                      <TooltipContent side="top" className="text-xs">
                        {label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5">
        <span className="text-[11px] text-muted-foreground">Less</span>
        {[0, 1, 2, 3, 5].map((count) => (
          <div key={count} className={cn("h-3 w-3 rounded-[2px]", getIntensityClass(count))} />
        ))}
        <span className="text-[11px] text-muted-foreground">More</span>
      </div>
    </div>
  )
}
