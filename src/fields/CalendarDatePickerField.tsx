import { ErrorMessage, useField } from "formik"
import React from "react"
import { DateRange } from "react-day-picker"
import { CalendarDatePicker, CalendarDatePickerProps } from "../components/CalendarDatePicker"
import FormError from "../components/FormError"
import Help from "../components/Help"
import { cn } from "../lib/cn"
import { Label } from "../primitives/label"

type CalendarDatePickerFieldProps = Omit<CalendarDatePickerProps, "date" | "onDateSelect"> & {
  name: string
  label?: string
  help?: string | React.ReactNode
  required?: boolean
  disableFn?: (date: Date) => boolean
  className?: string
  containerClassName?: string
  closeOnSelect?: boolean
  numberOfMonths?: 1 | 2
  yearsRange?: number
  onDateSelectChange?: (date: DateRange) => void
}

export default function CalendarDatePickerField({
  label,
  help,
  className,
  containerClassName,
  required,
  onDateSelectChange,
  ...props
}: CalendarDatePickerFieldProps) {
  const [field, _, helpers] = useField<DateRange>(props.name)
  return (
    <div className={cn(`flex flex-col text-primary mb-2 gap-1 ${containerClassName}`)}>
      {label && (
        <Label htmlFor={props.name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <CalendarDatePicker
        date={field.value || { from: undefined, to: undefined }}
        onDateSelect={function (range: { from: Date; to: Date }): void {
          helpers.setValue(range)
          if (onDateSelectChange) {
            onDateSelectChange(range)
          }
        }}
        variant={"outline"}
        className={cn(`w-fit ${className}`)}
        {...props}
      />
      {help && <Help>{help}</Help>}
      <ErrorMessage name={props.name} component={FormError} />
    </div>
  )
}
