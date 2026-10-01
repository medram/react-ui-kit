import { format } from "date-fns"
import { ErrorMessage, useField } from "formik"
import { CalendarIcon } from "lucide-react"
import type React from "react"
import { useState } from "react"
import FormError from "../components/FormError"
import Help from "../components/Help"
import {
  createCalendarDate,
  currentDateInTimeZone,
  formatCalendarDate,
  lastDayOfCalendarMonth,
  parseCalendarDate,
  resolveTimeZone,
} from "../lib/date-time"
import { cn } from "../lib/cn"
import { Button } from "../primitives/button"
import { Calendar, CalendarProps } from "../primitives/calendar"
import { Label } from "../primitives/label"
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/popover"

type DateSelectorFieldProps = {
  name: string
  label?: string
  help?: string | React.ReactNode
  required?: boolean
  className?: string
  placeholder?: string
  disableFn?: (date: Date) => boolean
  onChange?: (date: Date) => void
  disabled?: boolean
  timezone?: string
} & CalendarProps

export default function DateSelectorField({
  name,
  label,
  help,
  required = false,
  className,
  placeholder = "Pick a date",
  disableFn,
  onChange,
  disabled,
  timezone,
  today,
  ...props
}: DateSelectorFieldProps) {
  const [field, _meta, helpers] = useField<Date | string>(name)
  const resolvedTimeZone = resolveTimeZone(timezone)
  const selectedDate = parseCalendarDate(field.value)
  const currentDate = currentDateInTimeZone(resolvedTimeZone)
  const navigationDate = selectedDate ?? currentDate
  const yearAnchor = selectedDate?.getFullYear() ?? currentDate.getFullYear()
  const [month, setMonth] = useState<number>(navigationDate.getMonth())
  const [year, setYear] = useState<number>(navigationDate.getFullYear())

  const setFieldValue = (yearValue: number, monthIndex: number, day: number) => {
    const lastDay = lastDayOfCalendarMonth(yearValue, monthIndex)
    if (lastDay === null) return

    const calendarDate = createCalendarDate(
      yearValue,
      monthIndex,
      Math.min(Math.max(day, 1), lastDay),
    )
    if (calendarDate) helpers.setValue(formatCalendarDate(calendarDate))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (!date) {
      helpers.setValue("")
      return
    }

    const calendarDate = createCalendarDate(date.getFullYear(), date.getMonth(), date.getDate())
    if (!calendarDate) return

    helpers.setValue(formatCalendarDate(calendarDate))
    onChange?.(calendarDate)
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = Number.parseInt(event.target.value, 10)
    setMonth(newMonth)
    setFieldValue(year, newMonth, selectedDate?.getDate() ?? 1)
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = Number.parseInt(event.target.value, 10)
    setYear(newYear)
    setFieldValue(newYear, month, selectedDate?.getDate() ?? 1)
  }

  return (
    <div key={name} className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.value && "text-muted-foreground",
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value && selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="flex w-auto flex-col space-y-2 p-0">
          <div className="flex space-x-2 px-2 py-2">
            <select value={month} onChange={handleMonthChange} className="border rounded p-1">
              {Array.from({ length: 12 }, (_, index) => {
                const monthDate = createCalendarDate(year, index, 1)
                return (
                  <option key={index} value={index}>
                    {monthDate ? format(monthDate, "MMMM") : ""}
                  </option>
                )
              })}
            </select>
            <select
              value={year}
              onChange={handleYearChange}
              className="border rounded p-1"
              suppressHydrationWarning
            >
              {Array.from({ length: 100 }, (_, index) => {
                const yearOption = yearAnchor - index
                return (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                )
              })}
            </select>
          </div>

          <Calendar
            key={`${year}-${month}`}
            {...field}
            {...props}
            mode="single"
            selected={selectedDate ?? undefined}
            today={today ?? currentDate}
            onMonthChange={(date) => {
              setMonth(date.getMonth())
              setYear(date.getFullYear())
            }}
            month={createCalendarDate(year, month, 1) ?? currentDate}
            onSelect={handleDateChange}
            disabled={disableFn}
            required={required}
          />
        </PopoverContent>
      </Popover>
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
