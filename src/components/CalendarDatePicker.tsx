"use client"

import { cva, VariantProps } from "class-variance-authority"
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns"
import { formatInTimeZone, toDate } from "date-fns-tz"
import { CalendarIcon } from "lucide-react"
import * as React from "react"
import { ClassNames, DateRange } from "react-day-picker"

import { cn } from "../lib/cn"
import { Button } from "../primitives/button"
import { Calendar } from "../primitives/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../primitives/select"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const multiSelectVariants = cva(
  "flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 !m-0",
  {
    variants: {
      variant: {
        default:
          "border-2 border-solid border-foreground/10 bg-background hover:bg-accent hover:text-accent-foreground",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export type CalendarDatePickerProps = React.HTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof multiSelectVariants> & {
    id?: string
    className?: string
    date: DateRange
    closeOnSelect?: boolean
    numberOfMonths?: 1 | 2
    yearsRange?: number
    yearsOrder?: "asc" | "desc"
    minYear?: number
    maxYear?: number
    preventFuture?: boolean
    onDateSelect: ({ from, to }: { from: Date; to: Date }) => void
    enableWheel?: boolean
    popOverPosition?: "center" | "start" | "end"
    placeholder?: string
    classNames?: Partial<ClassNames>
    ref?: React.Ref<HTMLButtonElement>
  }

const EMPTY_CLASSNAMES: Partial<ClassNames> = {}

// react-doctor-disable-next-line react-doctor/no-giant-component
export function CalendarDatePicker({
  id = "calendar-date-picker",
  className,
  date,
  enableWheel = true,
  placeholder = "Pick a date",
  closeOnSelect = false,
  popOverPosition = "center",
  numberOfMonths = 2,
  yearsRange = 20,
  yearsOrder = "asc",
  minYear,
  maxYear,
  preventFuture = false,
  onDateSelect,
  variant,
  classNames = EMPTY_CLASSNAMES,
  ref,
  ...props
}: CalendarDatePickerProps) {
  // react-doctor-disable-line react-doctor/prefer-useReducer
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [selectedRange, setSelectedRange] = React.useState<string | null>(null)
  const [highlightedPart, setHighlightedPart] = React.useState<string | null>(null)

  // Calendar navigation state — what month/year the dropdowns and calendar
  // are showing. Initialized from `date` once; the user can independently
  // navigate around without changing the selected range.
  const [monthFrom, setMonthFrom] = React.useState<Date | undefined>(date?.from)
  const [yearFrom, setYearFrom] = React.useState<number | undefined>(date?.from?.getFullYear())
  const [monthTo, setMonthTo] = React.useState<Date | undefined>(
    numberOfMonths === 2 ? date?.to : date?.from,
  )
  const [yearTo, setYearTo] = React.useState<number | undefined>(
    numberOfMonths === 2 ? date?.to?.getFullYear() : date?.from?.getFullYear(),
  )

  // Dropdown index/year reflect the calendar navigation state directly, so
  // they live as derived values instead of state mirrors.
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const selectedMonthIndexFrom = monthFrom?.getMonth() ?? currentMonth
  const selectedYearFrom = yearFrom ?? currentYear
  const selectedMonthIndexTo = monthTo?.getMonth() ?? currentMonth
  const selectedYearTo = yearTo ?? currentYear

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const handleClose = () => setIsPopoverOpen(false)
  const handleTogglePopover = () => setIsPopoverOpen((prev) => !prev)

  const handleRangeDateChange = ({ from, to }: { from: Date; to: Date }) => {
    onDateSelect({ from, to })
  }

  const selectDateRange = (from: Date, to: Date, range: string) => {
    const startDate = startOfDay(toDate(from, { timeZone }))
    const endDate = numberOfMonths === 2 ? endOfDay(toDate(to, { timeZone })) : startDate
    handleRangeDateChange({ from: startDate, to: endDate })
    setSelectedRange(range)
    setMonthFrom(from)
    setYearFrom(from.getFullYear())
    setMonthTo(to)
    setYearTo(to.getFullYear())
    if (closeOnSelect) setIsPopoverOpen(false)
  }

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      let from = startOfDay(toDate(range.from as Date, { timeZone }))
      let to = range.to ? endOfDay(toDate(range.to, { timeZone })) : from
      if (preventFuture) {
        const maxDate = endOfDay(today)
        if (from > maxDate) from = startOfDay(today)
        if (to > maxDate) to = numberOfMonths === 2 ? maxDate : from
      }
      if (numberOfMonths === 1) {
        if (range.from !== date.from) {
          to = from
        } else {
          from = startOfDay(toDate(range.to as Date, { timeZone }))
        }
      }
      setMonthFrom(from)
      setYearFrom(from.getFullYear())
      setMonthTo(to)
      setYearTo(to.getFullYear())
      handleRangeDateChange({ from, to })
    }
    setSelectedRange(null)
  }

  const handleMonthChange = (monthName: string, part: string) => {
    let newMonthIndex = months.indexOf(monthName)
    setSelectedRange(null)

    if (part === "from") {
      if (preventFuture && selectedYearFrom >= currentYear) {
        newMonthIndex = Math.min(newMonthIndex, currentMonth)
      }

      const newMonth = new Date(selectedYearFrom, newMonthIndex, 1)
      const from =
        numberOfMonths === 2
          ? startOfMonth(toDate(newMonth, { timeZone }))
          : date?.from
            ? new Date(selectedYearFrom, newMonthIndex, date.from.getDate())
            : newMonth
      const to =
        numberOfMonths === 2
          ? date.to
            ? endOfDay(toDate(date.to, { timeZone }))
            : endOfMonth(toDate(newMonth, { timeZone }))
          : from
      if (from <= to) {
        handleRangeDateChange({ from, to })
        setMonthFrom(newMonth)
        setMonthTo(date.to)
      }
    } else {
      if (preventFuture && selectedYearTo >= currentYear) {
        newMonthIndex = Math.min(newMonthIndex, currentMonth)
      }

      const newMonth = new Date(selectedYearTo, newMonthIndex, 1)
      const from = date.from
        ? startOfDay(toDate(date.from, { timeZone }))
        : startOfMonth(toDate(newMonth, { timeZone }))
      const to = numberOfMonths === 2 ? endOfMonth(toDate(newMonth, { timeZone })) : from
      if (from <= to) {
        handleRangeDateChange({ from, to })
        setMonthTo(newMonth)
        setMonthFrom(date.from)
      }
    }
  }

  const handleYearChange = (yearString: string, part: string) => {
    const newYear = Number(yearString)
    setSelectedRange(null)

    if (part === "from") {
      if (!years.includes(newYear)) return
      const adjustedMonthIndex =
        preventFuture && newYear >= currentYear
          ? Math.min(selectedMonthIndexFrom, currentMonth)
          : selectedMonthIndexFrom
      const newMonth = new Date(newYear, adjustedMonthIndex, 1)
      const from =
        numberOfMonths === 2
          ? startOfMonth(toDate(newMonth, { timeZone }))
          : date.from
            ? new Date(newYear, adjustedMonthIndex, date.from.getDate())
            : newMonth
      const to =
        numberOfMonths === 2
          ? date.to
            ? endOfDay(toDate(date.to, { timeZone }))
            : endOfMonth(toDate(newMonth, { timeZone }))
          : from
      if (from <= to) {
        handleRangeDateChange({ from, to })
        setYearFrom(newYear)
        setMonthFrom(newMonth)
        setYearTo(date.to?.getFullYear())
        setMonthTo(date.to)
      }
    } else {
      if (!years.includes(newYear)) return
      const adjustedMonthIndex =
        preventFuture && newYear >= currentYear
          ? Math.min(selectedMonthIndexTo, currentMonth)
          : selectedMonthIndexTo
      const newMonth = new Date(newYear, adjustedMonthIndex, 1)
      const from = date.from
        ? startOfDay(toDate(date.from, { timeZone }))
        : startOfMonth(toDate(newMonth, { timeZone }))
      const to = numberOfMonths === 2 ? endOfMonth(toDate(newMonth, { timeZone })) : from
      if (from <= to) {
        handleRangeDateChange({ from, to })
        setYearTo(newYear)
        setMonthTo(newMonth)
        setYearFrom(date.from?.getFullYear())
        setMonthFrom(date.from)
      }
    }
  }

  // Resolve max year bound considering preventFuture
  let resolvedMaxYear = typeof maxYear === "number" ? maxYear : currentYear
  if (!preventFuture && typeof maxYear !== "number") {
    // Preserve previous behavior when no bounds provided: center around today
    resolvedMaxYear = currentYear + Math.floor(yearsRange / 2)
  }
  if (preventFuture) {
    resolvedMaxYear = Math.min(resolvedMaxYear, currentYear)
  }

  // Resolve min year bound
  let resolvedMinYear: number
  if (typeof minYear === "number") {
    resolvedMinYear = minYear
  } else {
    resolvedMinYear = resolvedMaxYear - yearsRange
  }
  if (resolvedMinYear > resolvedMaxYear) {
    resolvedMinYear = resolvedMaxYear
  }

  const years = Array.from(
    { length: resolvedMaxYear - resolvedMinYear + 1 },
    (_, i) => resolvedMinYear + i,
  )
  if (yearsOrder === "desc") years.reverse()

  const dateRanges = [
    { label: "Today", start: today, end: today },
    { label: "Yesterday", start: subDays(today, 1), end: subDays(today, 1) },
    {
      label: "This Week",
      start: startOfWeek(today, { weekStartsOn: 1 }),
      end: endOfWeek(today, { weekStartsOn: 1 }),
    },
    {
      label: "Last Week",
      start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
      end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
    },
    { label: "Last 7 Days", start: subDays(today, 6), end: today },
    {
      label: "This Month",
      start: startOfMonth(today),
      end: endOfMonth(today),
    },
    {
      label: "Last Month",
      start: startOfMonth(subDays(today, today.getDate())),
      end: endOfMonth(subDays(today, today.getDate())),
    },
    { label: "This Year", start: startOfYear(today), end: endOfYear(today) },
    {
      label: "Last Year",
      start: startOfYear(subDays(today, 365)),
      end: endOfYear(subDays(today, 365)),
    },
  ]

  const handleHighlight = (part: string) => {
    if (enableWheel) setHighlightedPart(part)
  }

  const handleUnhighlight = () => {
    setHighlightedPart(null)
  }

  const handleWheel = (event: React.WheelEvent, _part: string) => {
    event.preventDefault()
    setSelectedRange(null)
    if (highlightedPart === "firstDay") {
      let newDate = new Date(date.from as Date)
      const increment = event.deltaY > 0 ? -1 : 1
      newDate.setDate(newDate.getDate() + increment)
      if (preventFuture && newDate > today) newDate = today
      if (newDate <= (date.to as Date)) {
        if (numberOfMonths === 2) {
          handleRangeDateChange({ from: newDate, to: new Date(date.to as Date) })
        } else {
          handleRangeDateChange({ from: newDate, to: newDate })
        }
        setMonthFrom(newDate)
      } else if (newDate > (date.to as Date) && numberOfMonths === 1) {
        handleRangeDateChange({ from: newDate, to: newDate })
        setMonthFrom(newDate)
      }
    } else if (highlightedPart === "firstMonth") {
      const newMonthIndex = selectedMonthIndexFrom + (event.deltaY > 0 ? -1 : 1)
      const maxMonthForYear = preventFuture && selectedYearFrom >= currentYear ? currentMonth : 11
      if (newMonthIndex >= 0 && newMonthIndex <= maxMonthForYear) {
        handleMonthChange(months[newMonthIndex], "from")
      }
    } else if (highlightedPart === "firstYear") {
      const newYear = selectedYearFrom + (event.deltaY > 0 ? -1 : 1)
      if (years.includes(newYear)) {
        handleYearChange(newYear.toString(), "from")
      }
    } else if (highlightedPart === "secondDay") {
      let newDate = new Date(date.to as Date)
      const increment = event.deltaY > 0 ? -1 : 1
      newDate.setDate(newDate.getDate() + increment)
      if (preventFuture && newDate > today) newDate = today
      if (newDate >= (date.from as Date)) {
        handleRangeDateChange({ from: new Date(date.from as Date), to: newDate })
        setMonthTo(newDate)
      }
    } else if (highlightedPart === "secondMonth") {
      const newMonthIndex = selectedMonthIndexTo + (event.deltaY > 0 ? -1 : 1)
      const maxMonthForYear = preventFuture && selectedYearTo >= currentYear ? currentMonth : 11
      if (newMonthIndex >= 0 && newMonthIndex <= maxMonthForYear) {
        handleMonthChange(months[newMonthIndex], "to")
      }
    } else if (highlightedPart === "secondYear") {
      const newYear = selectedYearTo + (event.deltaY > 0 ? -1 : 1)
      if (years.includes(newYear)) {
        handleYearChange(newYear.toString(), "to")
      }
    }
  }

  const handleWheelRef = React.useRef(handleWheel)
  handleWheelRef.current = handleWheel

  React.useEffect(() => {
    const firstDayElement = document.getElementById(`firstDay-${id}`)
    const firstMonthElement = document.getElementById(`firstMonth-${id}`)
    const firstYearElement = document.getElementById(`firstYear-${id}`)
    const secondDayElement = document.getElementById(`secondDay-${id}`)
    const secondMonthElement = document.getElementById(`secondMonth-${id}`)
    const secondYearElement = document.getElementById(`secondYear-${id}`)

    const elements = [
      firstDayElement,
      firstMonthElement,
      firstYearElement,
      secondDayElement,
      secondMonthElement,
      secondYearElement,
    ]

    const wheelListener = (e: Event) => handleWheelRef.current(e as unknown as React.WheelEvent, "")

    const addWheelListener = (element: HTMLElement | null) => {
      if (element && enableWheel) {
        // Intentionally non-passive: the picker hijacks vertical wheel events
        // to step through dates/months/years and must preventDefault to stop
        // the page from scrolling.
        // react-doctor-disable-next-line react-doctor/client-passive-event-listeners
        element.addEventListener("wheel", wheelListener, { passive: false })
      }
    }

    elements.forEach(addWheelListener)

    return () => {
      elements.forEach((element) => {
        if (element && enableWheel) {
          element.removeEventListener("wheel", wheelListener)
        }
      })
    }
  }, [enableWheel, id])

  const formatWithTz = (date: Date, fmt: string) => formatInTimeZone(date, timeZone, fmt)

  const displayFrom = date?.from
  const displayTo = date?.to

  // date-part highlighters mirror across mouse and focus so the wheel feature
  // also surfaces for keyboard/screen-reader users who tab into the trigger.
  const partHandlers = (part: string) => ({
    onMouseOver: () => handleHighlight(part),
    onMouseLeave: handleUnhighlight,
    onFocus: () => handleHighlight(part),
    onBlur: handleUnhighlight,
  })

  return (
    <>
      <style>
        {`
            .date-part {
              touch-action: none;
            }
          `}
      </style>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            ref={ref}
            {...props}
            className={cn("w-auto h-8", multiSelectVariants({ variant, className }))}
            onClick={handleTogglePopover}
            suppressHydrationWarning
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>
              {displayFrom ? (
                displayTo ? (
                  <>
                    <span
                      id={`firstDay-${id}`}
                      className={cn(
                        "date-part",
                        highlightedPart === "firstDay" && "underline font-bold",
                      )}
                      {...partHandlers("firstDay")}
                    >
                      {formatWithTz(displayFrom as Date, "dd")}
                    </span>{" "}
                    <span
                      id={`firstMonth-${id}`}
                      className={cn(
                        "date-part",
                        highlightedPart === "firstMonth" && "underline font-bold",
                      )}
                      {...partHandlers("firstMonth")}
                    >
                      {formatWithTz(displayFrom as Date, "LLL")}
                    </span>
                    ,{" "}
                    <span
                      id={`firstYear-${id}`}
                      className={cn(
                        "date-part",
                        highlightedPart === "firstYear" && "underline font-bold",
                      )}
                      {...partHandlers("firstYear")}
                    >
                      {formatWithTz(displayFrom as Date, "y")}
                    </span>
                    {numberOfMonths === 2 && (
                      <>
                        {" - "}
                        <span
                          id={`secondDay-${id}`}
                          className={cn(
                            "date-part",
                            highlightedPart === "secondDay" && "underline font-bold",
                          )}
                          {...partHandlers("secondDay")}
                        >
                          {formatWithTz(displayTo as Date, "dd")}
                        </span>{" "}
                        <span
                          id={`secondMonth-${id}`}
                          className={cn(
                            "date-part",
                            highlightedPart === "secondMonth" && "underline font-bold",
                          )}
                          {...partHandlers("secondMonth")}
                        >
                          {formatWithTz(displayTo as Date, "LLL")}
                        </span>
                        ,{" "}
                        <span
                          id={`secondYear-${id}`}
                          className={cn(
                            "date-part",
                            highlightedPart === "secondYear" && "underline font-bold",
                          )}
                          {...partHandlers("secondYear")}
                        >
                          {formatWithTz(displayTo as Date, "y")}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span
                      id="day"
                      className={cn(
                        "date-part",
                        highlightedPart === "day" && "underline font-bold",
                      )}
                      {...partHandlers("day")}
                    >
                      {formatWithTz(displayFrom as Date, "dd")}
                    </span>{" "}
                    <span
                      id="month"
                      className={cn(
                        "date-part",
                        highlightedPart === "month" && "underline font-bold",
                      )}
                      {...partHandlers("month")}
                    >
                      {formatWithTz(displayFrom as Date, "LLL")}
                    </span>
                    ,{" "}
                    <span
                      id="year"
                      className={cn(
                        "date-part",
                        highlightedPart === "year" && "underline font-bold",
                      )}
                      {...partHandlers("year")}
                    >
                      {formatWithTz(displayFrom as Date, "y")}
                    </span>
                  </>
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        {isPopoverOpen && (
          <PopoverContent
            className="w-auto"
            align={popOverPosition}
            avoidCollisions={false}
            onInteractOutside={handleClose}
            onEscapeKeyDown={handleClose}
            style={{
              maxHeight: "var(--radix-popover-content-available-height)",
              overflowY: "auto",
            }}
          >
            <div className="flex">
              {numberOfMonths === 2 && (
                <div className="hidden md:flex flex-col gap-1 pr-4 text-left border-r border-foreground/10">
                  {dateRanges.map(({ label, start, end }) => (
                    <Button
                      key={label}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "justify-start hover:bg-primary/90 hover:text-background",
                        selectedRange === label &&
                          "bg-primary text-background hover:bg-primary/90 hover:text-background",
                      )}
                      onClick={() => {
                        selectDateRange(start, end, label)
                        setMonthFrom(start)
                        setYearFrom(start.getFullYear())
                        setMonthTo(end)
                        setYearTo(end.getFullYear())
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              )}
              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2 ml-3">
                    <Select
                      onValueChange={(value) => {
                        handleMonthChange(value, "from")
                        setSelectedRange(null)
                      }}
                      value={monthFrom ? months[monthFrom.getMonth()] : undefined}
                    >
                      <SelectTrigger className="hidden sm:flex w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent hover:text-accent-foreground">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value) => {
                        handleYearChange(value, "from")
                        setSelectedRange(null)
                      }}
                      value={yearFrom ? yearFrom.toString() : undefined}
                    >
                      <SelectTrigger className="hidden sm:flex w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent hover:text-accent-foreground">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {numberOfMonths === 2 && (
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(value) => {
                          handleMonthChange(value, "to")
                          setSelectedRange(null)
                        }}
                        value={monthTo ? months[monthTo.getMonth()] : undefined}
                      >
                        <SelectTrigger className="hidden sm:flex w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent hover:text-accent-foreground">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(value) => {
                          handleYearChange(value, "to")
                          setSelectedRange(null)
                        }}
                        value={yearTo ? yearTo.toString() : undefined}
                      >
                        <SelectTrigger className="hidden sm:flex w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent hover:text-accent-foreground">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className={`${numberOfMonths === 1 ? "hidden" : ""} flex"`}>
                  <Calendar
                    mode="range"
                    defaultMonth={monthFrom}
                    month={monthFrom}
                    onMonthChange={setMonthFrom}
                    onSelect={handleDateSelect}
                    numberOfMonths={numberOfMonths}
                    selected={date}
                    className={className}
                    captionLayout="dropdown"
                    classNames={classNames}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        )}
      </Popover>
    </>
  )
}
