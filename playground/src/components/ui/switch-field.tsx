import { ErrorMessage, useField } from "formik"
import { ButtonHTMLAttributes } from "react"
import FormError from "@/components/ui/form-error"
import Help from "@/components/ui/help"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type SwitchSize = "small" | "medium" | "large"

type SwitchFieldProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  name: string
  label?: string
  help?: string | React.ReactNode
  switchLabel?: string
  switchLabelClassName?: string
  size?: SwitchSize
  className?: string
  labelClassName?: string
  required?: boolean
  onChange?: (checked: boolean) => void
}

export default function SwitchField({
  name,
  label,
  help,
  className,
  required = false,
  switchLabel,
  labelClassName,
  switchLabelClassName,
  size = "medium",
  onChange,
  ...props
}: SwitchFieldProps) {
  // Use Formik's useField hook to access field properties and helpers
  const [field, meta, helpers] = useField<boolean>({
    name,
    validate: (value) => {
      if (required && !value) {
        return "This field is required"
      }
    },
  })

  return (
    <div key={name} className={cn(`flex flex-col text-primary mb-2 gap-1`)}>
      {label && (
        <Label htmlFor={name} className={cn("mb-2 cursor-pointer", labelClassName)}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="flex items-center gap-2">
        <Switch
          id={name}
          {...props}
          size={size === "small" ? "sm" : "default"}
          className={cn(size === "large" && "h-6 w-11", className)}
          checked={!!field.value}
          onCheckedChange={(checked) => {
            helpers.setValue(checked)
            onChange?.(checked)
          }}
        />
        {switchLabel && (
          <Label htmlFor={name} className={cn("cursor-pointer", switchLabelClassName)}>
            {switchLabel}
          </Label>
        )}
      </div>
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
