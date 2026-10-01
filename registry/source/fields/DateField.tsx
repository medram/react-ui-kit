import { format } from "date-fns"
import { ErrorMessage, useField } from "formik"
import { CalendarIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import FormError from "@/components/ui/form-error"
import Help from "@/components/ui/help"
import {
  createCalendarDate,
  currentDateInTimeZone,
  formatCalendarDate,
  parseCalendarDate,
  resolveTimeZone,
} from "@/components/ui/medram-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DateFieldProps = {
  name: string
  label?: string
  help?: string | ReactNode
  required?: boolean
  className?: string
  placeholder?: string
  disableFn?: (date: Date) => boolean
  onChange?: (date: Date) => void
  disabled?: boolean
  timezone?: string
} & Omit<ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect" | "disabled">

export default function DateField({
  name,
  label,
  help,
  required = false,
  className,
  placeholder = "Pick a date",
  disableFn,
  onChange,
  disabled,
  captionLayout = "dropdown",
  defaultMonth,
  today,
  timezone,
  ...props
}: DateFieldProps) {
  const [field, _meta, helpers] = useField<Date | string>(name)
  const resolvedTimeZone = resolveTimeZone(timezone)
  const selectedDate = parseCalendarDate(field.value)
  const currentDate = currentDateInTimeZone(resolvedTimeZone)

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

        <PopoverContent className="w-auto p-0">
          <Calendar
            {...field}
            {...props}
            mode="single"
            captionLayout={captionLayout}
            defaultMonth={defaultMonth ?? selectedDate ?? currentDate}
            today={today ?? currentDate}
            selected={selectedDate ?? undefined}
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
