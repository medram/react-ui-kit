import { cn } from "../lib/cn"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../primitives/select"

export type SelectOptions<T> = {
  readonly label: string
  readonly value: T
}

export type SelectProps<T extends string | number | null> = {
  options: SelectOptions<T>[]
  defaultValue?: T
  className?: string
  placeholder?: string
  onChange?: (value: T, selectedOption: SelectOptions<T> | undefined) => void
} & Omit<React.ComponentProps<typeof Select>, "onValueChange" | "defaultValue">

export default function BaseSelect<
  T extends string | number | null | (string | null) | (number | null),
>({
  options,
  name,
  defaultValue,
  required = false,
  className,
  placeholder = "Select an option...",
  onChange,
  ...props
}: SelectProps<T>) {
  return (
    <div className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      <Select
        onValueChange={(value) => {
          // needed to return the correct/original type
          const selectedOption = options.find(
            (option) => `${option.value}` == value || (`${option.value}` === "" && value === "-"),
          ) as SelectOptions<T>

          onChange?.(selectedOption.value, selectedOption)
        }}
        defaultValue={`${defaultValue ?? ""}`}
        {...props}
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
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
