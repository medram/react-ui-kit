import { ErrorMessage, useField } from "formik"
import { InputHTMLAttributes } from "react"
import FormError from "../components/FormError"
import Help from "../components/Help"
import { cn } from "../lib/cn"
import { Input } from "../primitives/input"
import { Label } from "../primitives/label"

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label?: string
  className?: string
  InputClassName?: string
  required?: boolean
  help?: string | React.ReactNode
}

export default function InputField({
  name,
  label,
  InputClassName,
  className,
  required = false,
  help,
  ...props
}: InputFieldProps) {
  // Use Formik's useField hook to access field properties and helpers
  const [field] = useField<string>(name)

  return (
    <div key={`input-${name}`} className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Input
        {...field}
        {...props}
        className={InputClassName}
        id={`input-${name}`}
        value={field.value ?? ""}
      />
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
