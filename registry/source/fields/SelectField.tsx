import { ErrorMessage, useField } from "formik"
import FormError from "@/components/ui/form-error"
import Help from "@/components/ui/help"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type SelectOptions<T> = {
  readonly label: string
  readonly value: T
}

// This is a temporary value to represent the empty string value "" in the select field (Must be unpredictable)
const TEMP_NULL_OPTION_VALUE: string = "-----------------"

export type SelectFieldProps<T extends string | number | null> = {
  name: string
  options: SelectOptions<T>[]
  label?: string
  required?: boolean
  className?: string
  optionLabel?: string
  placeholder?: string
  nullable?: boolean
  help?: string | React.ReactNode
  errorMessage?: string
  onChange?: (value: T, selectedOption: SelectOptions<T>) => void
} & Omit<React.ComponentProps<typeof Select>, "onValueChange" | "defaultValue">

export default function SelectField<
  T extends string | number | null | (string | null) | (number | null),
>({
  name,
  label,
  required = false,
  className,
  options,
  optionLabel,
  placeholder = "Select an option...",
  help,
  errorMessage,
  onChange,
  ...props
}: SelectFieldProps<T>) {
  const [field, meta, helpers] = useField<T>({
    name,
    validate: (value: any) => {
      if (!value && required) {
        return errorMessage ?? "Please select an Item"
      }
      return undefined
    },
  })

  return (
    <div className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select
        onValueChange={(value: string) => {
          const nextValue =
            value === "null"
              ? (null as T)
              : typeof field.value === "number" || options.some((option) => typeof option.value === "number")
                ? (Number(value) as T)
                : ((value === TEMP_NULL_OPTION_VALUE ? "" : value) as T)
          helpers.setValue(nextValue)
          const selectedOption = options.find(
            (option) => String(option.value === "" ? TEMP_NULL_OPTION_VALUE : option.value) === value,
          )
          if (selectedOption) onChange?.(nextValue, selectedOption)
        }}
        defaultValue={`${field.value === "" ? TEMP_NULL_OPTION_VALUE : field.value}`}
        value={`${field.value === "" ? TEMP_NULL_OPTION_VALUE : field.value}`}
        {...props}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {optionLabel && <SelectLabel>{optionLabel}</SelectLabel>}
            {options.map((item) => (
              <SelectItem
                key={item.value}
                value={`${item.value === "" ? TEMP_NULL_OPTION_VALUE : item.value}`}
                className="cursor-pointer"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
