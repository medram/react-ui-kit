import { format, isValid, parseISO } from "date-fns"
import { ErrorMessage, useField } from "formik"
import { CalendarIcon } from "lucide-react"
import FormError from "@/components/ui/form-error"
import Help from "@/components/ui/help"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  yearsRange?: number
  yearsOrder?: "asc" | "desc"
  minYear?: number
  maxYear?: number
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
  yearsRange = 3,
  yearsOrder = "desc",
  minYear,
  maxYear,
}: MonthYearPickerFieldProps) {
  const [field, meta, helpers] = useField<Date | string>(name)

  const parsedDate =
    field.value instanceof Date
      ? field.value
      : field.value
        ? parseISO(field.value)
        : null
  const selectedDate = parsedDate && isValid(parsedDate) ? parsedDate : null

  const currentYear = new Date().getFullYear()
  const yearRange = Math.max(0, Math.floor(yearsRange))
  const resolvedMaxYear = maxYear ?? currentYear
  const resolvedMinYear = Math.min(minYear ?? resolvedMaxYear - yearRange, resolvedMaxYear)
  const years = Array.from(
    { length: resolvedMaxYear - resolvedMinYear + 1 },
    (_, index) => resolvedMinYear + index,
  )
  if (yearsOrder === "desc") years.reverse()

  const fallbackYear = resolvedMaxYear
  const yearId = `${name}-year`
  const monthId = `${name}-month`

  const handleDateChange = (month: number, year: number, day: number = defaultDay) => {
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
    const clampedDay = Math.min(Math.max(Math.trunc(day), 1), lastDayOfMonth)
    const newDate = new Date(year, month, clampedDay)
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(clampedDay).padStart(2, "0")}`

    helpers.setValue(formattedDate)
    onChange?.(newDate)
  }

  const getDisplayText = () => {
    if (selectedDate) {
      return format(selectedDate, "MMMM yyyy")
    }
    return placeholder
  }

  return (
    <div className={cn("flex flex-col text-primary mb-2 gap-1", className)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={name}
            type="button"
            variant={"outline"}
            aria-invalid={meta.touched && Boolean(meta.error)}
            aria-required={required}
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.value && "text-muted-foreground",
            )}
            disabled={disabled}
          >
            <CalendarIcon data-icon="inline-start" aria-hidden="true" />
            {getDisplayText()}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[calc(100vw-2rem)] max-w-80 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <Label htmlFor={yearId} className="mb-2 text-sm font-medium">
                Year
              </Label>
              <Select
                disabled={disabled}
                value={selectedDate ? selectedDate.getFullYear().toString() : ""}
                onValueChange={(value) => {
                  const year = parseInt(value, 10)
                  const month = selectedDate ? selectedDate.getMonth() : 0
                  handleDateChange(month, year)
                }}
              >
                <SelectTrigger id={yearId} className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <Label htmlFor={monthId} className="mb-2 text-sm font-medium">
                Month
              </Label>
              <Select
                disabled={disabled}
                value={selectedDate ? selectedDate.getMonth().toString() : ""}
                onValueChange={(value) => {
                  const month = parseInt(value, 10)
                  const year = selectedDate ? selectedDate.getFullYear() : fallbackYear
                  handleDateChange(month, year)
                }}
              >
                <SelectTrigger id={monthId} className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
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
