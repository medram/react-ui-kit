import { cn } from "../lib/cn"
import {
  Select as BaseSelect,
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

export type SelectProps<T extends string | number | null> = {
  options: SelectOptions<T>[]
  className?: string
  placeholder?: string
  optionLabel?: string
  value?: T
  onChange?: (value: T) => void
} & Omit<React.ComponentProps<typeof BaseSelect>, "onValueChange" | "defaultValue">

export default function Select<
  T extends string | number | null | (string | null) | (number | null),
>({
  className,
  options,
  placeholder = "Select an option...",
  onChange,
  optionLabel,
  value,
  ...props
}: SelectProps<T>) {
  return (
    <div className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      <BaseSelect
        onValueChange={(value) => {
          if (onChange) onChange(value as T)
        }}
        defaultValue={value}
        {...props}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {optionLabel && <SelectLabel>{optionLabel}</SelectLabel>}
            {options.map((item) => (
              <SelectItem key={item.value} value={String(item.value)} className="cursor-pointer">
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </BaseSelect>
    </div>
  )
}
