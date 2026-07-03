import Help from "../components/Help"
import { cn } from "../lib/cn"
import { Label } from "../primitives/label"
import { Select } from "../primitives/select"
import { Prettify } from "../types"

export type SelectOptions<T> = {
  readonly label: string
  readonly value: T
}
export type RenderProps<T> = {
  option: T
  disabled?: boolean
  selected?: boolean
  onClick?: () => void
}

export type SpecialSelectFieldProps<T> = Prettify<
  {
    label?: string
    options: T[]
    required?: boolean
    className?: string
    placeholder?: string
    nullable?: boolean
    help?: string | React.ReactNode
    errorMessage?: string
    onChange?: (value: T | null) => void
    onSelect: (selectedOption: T | null) => void
    render: (props: {
      option: T
      disabled?: boolean
      selected?: boolean
      onClick?: () => void
    }) => React.ReactNode
    disabled?: boolean
    itemContainerClassName?: string
    value?: T | null
  } & Omit<React.ComponentProps<typeof Select>, "onValueChange" | "defaultValue" | "value">
>

export function SpecialSelectField<T>({
  label,
  required = false,
  options,
  className,
  help,
  errorMessage,
  render,
  disabled,
  itemContainerClassName,
  onChange,
  onSelect,
  value = null,
}: SpecialSelectFieldProps<T>) {
  const selectedItem = value

  return (
    <div className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      {label && (
        <Label htmlFor="select" className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {errorMessage && <p className="text-red-500 text-sm my-1">{errorMessage}</p>}

      <div className={cn("flex flex-col gap-2", itemContainerClassName)}>
        {options.map((option) =>
          render({
            option,
            disabled,
            selected: selectedItem === option,
            onClick: () => {
              if (disabled) return
              if (selectedItem === option) {
                onChange?.(null)
                onSelect?.(null)
              } else {
                onChange?.(option)
                onSelect?.(option)
              }
            },
          }),
        )}
      </div>

      {help && <Help>{help}</Help>}
    </div>
  )
}
