// Note: using Radix Popover directly here to control the Portal container when inside Dialogs
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { useId, useMemo, useRef, useState } from "react"

import { ErrorMessage, useField } from "formik"
import FormError from "../components/FormError"
import Help from "../components/Help"
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
import { Label } from "../primitives/label"

type ComboBoxOption<T> = { label: string; value: T }

export type ComboBoxFieldProps<T> = {
  name: string
  availableItems: ComboBoxOption<T>[]
  label?: string
  className?: string
  required?: boolean
  disabled?: boolean
  searchPlaceholder?: string
  selectPlaceholder?: string
  noItemsFoundMessage?: string
  onChange?: (value: T, selectedOption: ComboBoxOption<T>) => void
  onSearchChange?: (search: string) => void
  help?: string
}

export default function ComboboxField<T extends string | number | null>({
  name,
  availableItems,
  label,
  className,
  required,
  disabled = false,
  searchPlaceholder = "Search Items...",
  selectPlaceholder = "Select items...",
  noItemsFoundMessage = "No items found.",
  onChange,
  onSearchChange,
  help,
}: ComboBoxFieldProps<T>) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [field, meta, helpers] = useField<T>(name)
  const listboxId = useId()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogContainer, setDialogContainer] = useState<HTMLElement | null>(null)

  const items = useMemo(() => {
    let updated = availableItems.filter((item) =>
      onSearchChange
        ? item.label.toLowerCase()
        : item.label.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    // If not required, add a clear option at the start
    if (!required) {
      updated = [{ label: "Select no item", value: "" as T }, ...updated]
    }
    return updated
  }, [availableItems, searchQuery, onSearchChange, required])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={cn(`flex flex-col text-primary mb-2 gap-1`, className, disabled && "opacity-60")}
    >
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <PopoverPrimitive.Root
        open={open}
        onOpenChange={(o) => {
          if (!disabled) {
            if (o && typeof window !== "undefined") {
              const container =
                (wrapperRef.current?.closest('[role="dialog"]') as HTMLElement | null) ?? null
              setDialogContainer(container)
            }
            setOpen(!!o)
          }
        }}
        modal={false}
      >
        <PopoverPrimitive.Trigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-haspopup="listbox"
            className="w-full justify-between"
            disabled={disabled}
          >
            <span>
              {field.value !== -1
                ? items.find((item) => item.value === field.value)?.label
                : selectPlaceholder}
            </span>
            <ChevronsUpDown className="opacity-50 size-4 ml-auto flex-shrink-0" />
          </Button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal container={dialogContainer}>
          <PopoverPrimitive.Content
            className="w-full p-0  border bg-popover text-popover-foreground shadow-md rounded-md z-50"
            hidden={disabled}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchQuery}
                onValueChange={handleSearch}
                disabled={disabled}
              />
              <CommandList id={listboxId}>
                <CommandEmpty>{noItemsFoundMessage}</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => {
                    return (
                      <CommandItem
                        key={item.value}
                        value={`${item.value}`}
                        onSelect={(currentValue) => {
                          if (disabled) return
                          setOpen(false)
                          if (typeof item.value === "number") {
                            helpers.setValue(parseInt(currentValue) as T)
                          } else {
                            helpers.setValue(currentValue as T)
                          }
                          onChange?.(currentValue as T, item)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === item.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
