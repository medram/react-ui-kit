import { cn } from "../lib/cn"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../primitives/select"

export type SelectOptions<T> = {
  readonly label: string
  readonly value: T
}

export type SelectInputProps<T extends string | number | null> = {
  options: SelectOptions<T>[]
  className?: string
  optionLabel?: string
  placeholder?: string
  onChange?: (value: T, selectedOption: SelectOptions<T>) => void
} & Omit<React.ComponentProps<typeof Select>, "onValueChange" | "defaultValue">

export default function SelectInput<T extends string | number | null>({
  className,
  options,
  optionLabel,
  placeholder = "Select an option...",
  onChange,
  ...props
}: SelectInputProps<T>) {
  return (
    <div className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      <Select
        onValueChange={(value) => {
          const selectedOption = options.find((option) => option.value == value)
          if (selectedOption) onChange?.(value as T, selectedOption)
        }}
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
                value={`${item.value === "" ? "-" : item.value}`}
                className="cursor-pointer"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
