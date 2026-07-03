import { useField } from "formik"
import Help from "../components/Help"
import { cn } from "../lib/cn"
import { Label } from "../primitives/label"
import { RadioGroup, RadioGroupItem } from "../primitives/radio-group"

export type RadioGroupOptions = {
  label: string
  value: string | number
}

type RadioGroupFieldProps = {
  name: string
  options: RadioGroupOptions[]
  label?: string
  help?: string | React.ReactNode
  required?: boolean
  className?: string
  radioItemClassName?: string
}

export default function RadioGroupField({
  options,
  name,
  label = "",
  help,
  required = false,
  className = "",
  radioItemClassName = "",
}: RadioGroupFieldProps) {
  const [field, meta, helpers] = useField<RadioGroupOptions["value"]>(name)

  return (
    <div className="flex flex-col gap-1">
      <RadioGroup
        defaultValue={`${field.value}`}
        onValueChange={(value) => {
          let parsedValue: RadioGroupOptions["value"] = value

          // If the value is a number, parse it to an integer
          if (typeof options[0]["value"] === "number") {
            parsedValue = parseInt(value)
          }

          helpers.setValue(parsedValue)
        }}
        className={className}
      >
        {label && (
          <Label className="mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        {options.map((item) => (
          <div className={cn(`flex items-center space-x-2`, radioItemClassName)} key={item.value}>
            <RadioGroupItem value={`${item.value}`} id={`radio-id-${item.value}`} />
            <Label htmlFor={`radio-id-${item.value}`} className="cursor-pointer">
              {item.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {help && <Help>{help}</Help>}
    </div>
  )
}
