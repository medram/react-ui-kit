import { useField } from "formik"
import type { InputHTMLAttributes } from "react"
import FormError from "@/components/ui/form-error"
import Help from "@/components/ui/help"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  const [field, meta] = useField<string>(name)
  const fieldId = `medram-${name}`
  const helpId = help ? `${fieldId}-help` : undefined
  const errorId = meta.touched && meta.error ? `${fieldId}-error` : undefined

  return (
    <div className={cn("mb-2 flex flex-col gap-1 text-primary", className)}>
      {label && (
        <Label htmlFor={fieldId} className="mb-2">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}
      <Input
        {...field}
        {...props}
        id={fieldId}
        className={InputClassName}
        value={field.value ?? ""}
        aria-invalid={Boolean(errorId)}
        aria-describedby={[helpId, errorId].filter(Boolean).join(" ") || undefined}
      />
      {help && <Help id={helpId}>{help}</Help>}
      {errorId && <FormError id={errorId}>{meta.error}</FormError>}
    </div>
  )
}
