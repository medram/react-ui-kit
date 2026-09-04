import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns"
import { ErrorMessage, useField } from "formik"
import { CalendarIcon } from "lucide-react"
import * as React from "react"
import FormError from "@/components/ui/form-error"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import Help from "@/components/ui/help"

type DateRangeFieldProps = {
  name: string
  label?: string
  help?: string | React.ReactNode
  required?: boolean
  className?: string
  placeholder?: string
  disableFn?: (date: Date) => boolean
  numberOfMonths?: number
  [key: string]: unknown
}

type DateRangePreset = {
  label: string
  start: Date
  end: Date
}

type CustomDateRange = { from: string | undefined; to?: string | undefined }

export default function DateRangeField({
  name,
  label,
  help,
  required = false,
  className,
  placeholder = "Pick a date range",
  disableFn,
  numberOfMonths = 2,
  ...props
}: DateRangeFieldProps) {
  const [field, meta, helpers] = useField<CustomDateRange>(name)

  const [selectedRange, setSelectedRange] = React.useState<string | null>(null)
  const today = new Date()
  const dateRanges: DateRangePreset[] = [
    { label: "Today", start: startOfDay(today), end: endOfDay(today) },
    {
      label: "Yesterday",
      start: startOfDay(subDays(today, 1)),
      end: endOfDay(subDays(today, 1)),
    },
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
    { label: "Last 7 Days", start: startOfDay(subDays(today, 6)), end: endOfDay(today) },
    { label: "This Month", start: startOfMonth(today), end: endOfMonth(today) },
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

  const selectDateRange = (start: Date, end: Date, label: string) => {
    helpers.setValue({ from: start.toISOString(), to: end.toISOString() })
    setSelectedRange(label)
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
              !field.value.from ? "text-muted-foreground" : "",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value && field.value.from ? (
              `${format(field.value.from, "PPP")} — ${
                field.value?.to ? format(field.value?.to, "PPP") : "?"
              }`
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <div className="flex">
            {numberOfMonths === 2 && (
              <div className="hidden flex-col gap-1 border-r border-foreground/10 p-3 pr-4 text-left md:flex">
                {dateRanges.map(({ label, start, end }) => (
                  <Button
                    key={label}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "justify-start hover:bg-primary/90 hover:text-background",
                      selectedRange === label &&
                        "bg-primary text-background hover:bg-primary/90 hover:text-background",
                    )}
                    onClick={() => selectDateRange(start, end, label)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            )}
            <Calendar
              mode="range"
              captionLayout="dropdown"
              selected={{
                from: field.value.from ? new Date(field.value.from) : undefined,
                to: field.value.to ? new Date(field.value.to) : undefined,
              }}
              onSelect={(date) => {
                if (date) {
                  helpers.setValue({
                    from: date.from ? date.from.toISOString() : "",
                    to: date?.to ? date.to.toISOString() : "",
                  })
                  setSelectedRange(null)
                }
              }}
              disabled={disableFn}
              numberOfMonths={numberOfMonths}
              {...field}
              {...props}
            />
          </div>
        </PopoverContent>
      </Popover>
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
