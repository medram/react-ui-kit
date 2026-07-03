import { ErrorMessage, useField } from "formik"
import { InputHTMLAttributes, useCallback } from "react"
import FormError from "../components/FormError"
import Help from "../components/Help"
import { cn } from "../lib/cn"
import { Label } from "../primitives/label"
import CheckBoxInputFieldThin, { CheckBoxInputFieldThinProps } from "./CheckBoxInputThinField"

export type CheckBoxFieldProps = InputHTMLAttributes<HTMLInputElement> &
  Omit<CheckBoxInputFieldThinProps, "checked" | "onCheckedChange"> & {
    label?: string
    className?: string
    required?: boolean
    help?: string | React.ReactNode
  }

export default function CheckBoxField({
  name,
  className,
  label,
  required = false,
  help,
  ...props
}: CheckBoxFieldProps) {
  // Use Formik's useField hook to access field properties and helpers
  const [field, _, helpers] = useField<boolean>(name)
  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      helpers.setValue(checked)
    },
    [helpers],
  )

  return (
    <div key={`input-${name}`} className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <CheckBoxInputFieldThin
        checked={field.value}
        onCheckedChange={handleCheckedChange}
        {...props}
        {...field}
      />
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
