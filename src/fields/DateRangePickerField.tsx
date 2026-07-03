import { format } from "date-fns"
import { ErrorMessage, useField } from "formik"
import { CalendarIcon } from "lucide-react"
import FormError from "../components/FormError"
import { cn } from "../lib/cn"
import { Button } from "../primitives/button"
import { Calendar } from "../primitives/calendar"
import { Label } from "../primitives/label"
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/popover"

import Help from "../components/Help"

type DatePickerFieldProps = {
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

type CustomDateRange = { from: string | undefined; to?: string | undefined }

export default function DateRangePickerField({
  name,
  label,
  help,
  required = false,
  className,
  placeholder = "Pick a date range",
  disableFn,
  numberOfMonths = 2,
  ...props
}: DatePickerFieldProps) {
  const [field, meta, helpers] = useField<CustomDateRange>(name)

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

        <PopoverContent className="flex w-auto flex-col space-y-2 p-0">
          <Calendar
            mode="range"
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
              }
            }}
            disabled={disableFn}
            numberOfMonths={numberOfMonths}
            {...field}
            {...props}
          />
        </PopoverContent>
      </Popover>
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
