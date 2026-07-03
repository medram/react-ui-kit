import { ErrorMessage, useField } from "formik"
import { ButtonHTMLAttributes } from "react"
import FormError from "../components/FormError"
import Help from "../components/Help"
import { cn } from "../lib/cn"
import { Label } from "../primitives/label"
import { Switch } from "../primitives/switch"

type SwitchSize = "small" | "medium" | "large"

type SwitchFieldProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  name: string
  label?: string
  help?: string | React.ReactNode
  switchLabel?: string
  switchLabelClassName?: string
  size?: SwitchSize
  className?: string
  thumbClassName?: string
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
  const { switchClassName, thumbClassName } = getSwitchSize(size)

  return (
    <div key={name} className={cn(`flex flex-col text-primary mb-2 gap-1`)}>
      {label && (
        <Label htmlFor={name} className={cn("mb-2 cursor-pointer", labelClassName)}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id={name}
          {...props}
          className={cn(switchClassName, className)}
          thumbClassName={cn(thumbClassName, props.thumbClassName)}
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

function getSwitchSize(size: SwitchSize): { switchClassName: string; thumbClassName: string } {
  switch (size) {
    case "small":
      return {
        switchClassName: "w-7 h-4",
        thumbClassName: "w-3 h-3 data-[state=checked]:translate-x-3",
      }
    case "medium":
      return {
        switchClassName: "w-9 h-5",
        thumbClassName: "w-4 h-4 data-[state=checked]:translate-x-4",
      }
    case "large":
      return {
        switchClassName: "w-11 h-6",
        thumbClassName: "w-5 h-5 data-[state=checked]:translate-x-5",
      }
  }
}
