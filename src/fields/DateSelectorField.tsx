import { format, isValid } from "date-fns"
import { ErrorMessage, useField } from "formik"
import { CalendarIcon } from "lucide-react"
import type React from "react"
import { useState } from "react"
import FormError from "../components/FormError"
import Help from "../components/Help"
import { cn } from "../lib/cn"
import { Button } from "../primitives/button"
import { Calendar, CalendarProps } from "../primitives/calendar"
import { Label } from "../primitives/label"
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/popover"

type DatePickerFieldProps = {
  name: string
  label?: string
  help?: string | React.ReactNode
  required?: boolean
  className?: string
  placeholder?: string
  disableFn?: (date: Date) => boolean
  onChange?: (date: Date) => void
  disabled?: boolean
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
  ...props
}: DatePickerFieldProps) {
  const [field, _meta, helpers] = useField<Date | string>(name)

  // selectedDate is derived from the form value — no useEffect mirror.
  const parsedDate = field.value ? new Date(field.value) : null
  const selectedDate = parsedDate && isValid(parsedDate) ? parsedDate : null

  // Calendar navigation (which month/year is visible). Initialized once from
  // the form value; subsequent navigation is user-driven via the dropdowns
  // and the calendar's arrow buttons.
  const today = new Date()
  const [month, setMonth] = useState<number>(selectedDate?.getMonth() ?? today.getMonth())
  const [year, setYear] = useState<number>(selectedDate?.getFullYear() ?? today.getFullYear())

  const setFieldValue = (date: Date | null) => {
    if (date) {
      // Adjust the date to compensate for the timezone difference.
      const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      const formattedDate = adjustedDate.toISOString().split("T")[0]
      helpers.setValue(formattedDate)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFieldValue(date)
      onChange?.(date)
    } else {
      helpers.setValue("")
    }
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(event.target.value, 10)
    setMonth(newMonth)
    const updatedDate = new Date(year, newMonth, selectedDate?.getDate() ?? 1)
    setFieldValue(updatedDate)
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value, 10)
    setYear(newYear)
    const updatedDate = new Date(newYear, month, selectedDate?.getDate() ?? 1)
    setFieldValue(updatedDate)
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
            {field.value && selectedDate && isValid(selectedDate) ? (
              format(selectedDate, "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="flex w-auto flex-col space-y-2 p-0">
          <div className="flex space-x-2 px-2 py-2">
            <select value={month} onChange={handleMonthChange} className="border rounded p-1">
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index} value={index}>
                  {format(new Date(year, index, 1), "MMMM")}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={handleYearChange}
              className="border rounded p-1"
              suppressHydrationWarning
            >
              {Array.from({ length: 100 }, (_, index) => {
                const yearOption = new Date().getFullYear() - index
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
            selected={selectedDate && isValid(selectedDate) ? selectedDate : undefined}
            onMonthChange={(date) => {
              setMonth(date.getMonth())
              setYear(date.getFullYear())
            }}
            month={new Date(year, month)}
            onSelect={(date) => handleDateChange(date)}
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
