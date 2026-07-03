import { Check, ChevronsUpDown } from "lucide-react"
import { useId, useMemo, useState } from "react"

import { cn } from "../lib/cn"
import { Button } from "../primitives/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../primitives/command"
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/popover"

type ComboBoxOption<T> = { label: string; value: T }

export type ComboBoxProps<T> = {
  value?: T
  availableItems: ComboBoxOption<T>[]
  className?: string
  required?: boolean
  searchPlaceholder?: string
  selectPlaceholder?: string
  noItemsFoundMessage?: string
  onChange?: (value: T, selectedOption: ComboBoxOption<T>) => void
  onSearchChange?: (search: string) => void
}

export default function Combobox<T extends string | number | null>({
  value,
  availableItems,
  className,
  required,
  searchPlaceholder = "Search Items...",
  selectPlaceholder = "Select items...",
  noItemsFoundMessage = "No items found.",
  onChange,
  onSearchChange,
}: ComboBoxProps<T>) {
  const listboxId = useId()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const items = useMemo(() => {
    let updated = availableItems.filter((item) =>
      onSearchChange
        ? item.label.toLowerCase()
        : item.label.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    if (!required) {
      updated = [{ label: "--- None ---", value: "" as T }, ...updated]
    }
    return updated
  }, [availableItems, searchQuery, onSearchChange, required])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (onSearchChange) {
      onSearchChange(query)
    }
  }

  return (
    <div className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-haspopup="listbox"
            className="w-full justify-between"
          >
            {value
              ? items.find((item) => `${item.value}` === `${value}`)?.label
              : selectPlaceholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onValueChange={handleSearch}
            />
            <CommandList id={listboxId}>
              <CommandEmpty>{noItemsFoundMessage}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => {
                  return (
                    <CommandItem
                      key={item.label}
                      value={`${item.value}`}
                      onSelect={(currentValue) => {
                        setOpen(false)
                        if (typeof item.value === "number") {
                          onChange?.(currentValue as T, item)
                        } else {
                          onChange?.(currentValue as T, item)
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
