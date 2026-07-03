import { ErrorMessage, useField } from "formik"
import React, { InputHTMLAttributes } from "react"
import FormError from "../components/FormError"
import Help from "../components/Help"
import { cn } from "../lib/cn"
import { Label } from "../primitives/label"
import { TimePicker } from "../time-picker/TimePicker"
import { convertTimetoDate } from "../utils"
export type TimePickerFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label?: string
  className?: string
  required?: boolean
  help?: string | React.ReactNode
  disabled?: boolean
}
export default function TimePickerField({
  name,
  label,
  className,
  required = false,
  help,
  disabled,
  ...props
}: TimePickerFieldProps) {
  const [field, meta, helpers] = useField<string>(name)

  function onChange(value: Date | undefined) {
    if (value) {
      const hour = `0${value.getHours()}`.slice(-2)
      const minute = `0${value.getMinutes()}`.slice(-2)
      helpers.setValue(`${hour}:${minute}`)
    } else {
      helpers.setValue("00:00")
    }
  }

  return (
    <div key={`input-${name}`} className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <TimePicker
        {...props}
        date={convertTimetoDate(field.value)}
        onChange={onChange}
        granularity="minute"
        disabled={disabled}
        id={`time-id-${name}`}
      />
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
