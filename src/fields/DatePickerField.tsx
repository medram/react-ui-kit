import { format, isValid } from "date-fns"
import { ErrorMessage, useField } from "formik"
import { CalendarIcon } from "lucide-react"
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
  includingTime?: boolean
  dateOnly?: boolean
} & CalendarProps

export default function DatePickerField({
  name,
  label,
  help,
  required = false,
  className,
  placeholder = "Pick a date",
  disableFn,
  onChange,
  disabled,
  includingTime = true,
  dateOnly = false,
  ...props
}: DatePickerFieldProps) {
  const [field, meta, helpers] = useField<Date | string>(name)

  // Parse the field value into a valid Date object if it exists
  const selectedDate = field.value ? new Date(field.value) : null

  const getFormattedDate = (date: Date) => {
    if (dateOnly) {
      return format(date, "yyyy-MM-dd")
    }
    return includingTime
      ? date.toISOString()
      : new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0]
  }

  return (
    <div key={name} className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Popover modal={true}>
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
          <Calendar
            {...field}
            {...props}
            mode="single"
            selected={selectedDate && isValid(selectedDate) ? selectedDate : undefined}
            defaultMonth={selectedDate && isValid(selectedDate) ? selectedDate : undefined} // Open calendar to the selected date
            onSelect={(date) => {
              helpers.setValue(date ? getFormattedDate(date) : "")
              if (date) onChange?.(date)
            }}
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
