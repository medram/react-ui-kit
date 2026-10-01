import { format } from "date-fns"
import { ErrorMessage, useField } from "formik"
import { CalendarIcon } from "lucide-react"
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
import { Label } from "../primitives/label"
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../primitives/select"

const months = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
]

type MonthYearPickerFieldProps = {
  name: string
  label?: string
  help?: string | React.ReactNode
  required?: boolean
  className?: string
  placeholder?: string
  onChange?: (date: Date) => void
  disabled?: boolean
  defaultDay?: number
  timezone?: string
}

export default function MonthYearPickerField({
  name,
  label,
  help,
  required = false,
  className,
  placeholder = "Pick a month and year",
  onChange,
  disabled,
  defaultDay = 1,
  timezone,
}: MonthYearPickerFieldProps) {
  const [field, _meta, helpers] = useField<Date | string>(name)
  const resolvedTimeZone = resolveTimeZone(timezone)
  const selectedDate = parseCalendarDate(field.value)
  const currentDate = currentDateInTimeZone(resolvedTimeZone)
  const currentYear = currentDate.getFullYear()
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]

  const handleDateChange = (monthIndex: number, year: number, day: number = defaultDay) => {
    const lastDay = lastDayOfCalendarMonth(year, monthIndex)
    if (lastDay === null) return

    const truncatedDay = Number.isFinite(day) ? Math.trunc(day) : 1
    const validDay = Math.min(Math.max(truncatedDay, 1), lastDay)
    const newDate = createCalendarDate(year, monthIndex, validDay)
    if (!newDate) return

    helpers.setValue(formatCalendarDate(newDate))
    onChange?.(newDate)
  }

  const getDisplayText = () => {
    if (field.value && selectedDate) {
      return format(selectedDate, "MMMM yyyy, dd")
    }
    return placeholder
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
            {getDisplayText()}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4">
          <div className="w-full flex gap-4 items-center justify-between">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Year</Label>
              <Select
                value={selectedDate ? selectedDate.getFullYear().toString() : ""}
                onValueChange={(value) => {
                  const year = Number.parseInt(value, 10)
                  const month = selectedDate ? selectedDate.getMonth() : 0
                  handleDateChange(month, year)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
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

            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Month</Label>
              <Select
                value={selectedDate ? selectedDate.getMonth().toString() : ""}
                onValueChange={(value) => {
                  const month = Number.parseInt(value, 10)
                  const year = selectedDate ? selectedDate.getFullYear() : currentYear
                  handleDateChange(month, year)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
