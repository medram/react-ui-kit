"use client"

import { useField } from "formik"
import * as React from "react"
import { cn } from "../lib/cn"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu"

export type DropdownOption = {
  label: string
  value: string
  disabled?: boolean
}

export type DropdownBoxProps = {
  name: string
  type: "checkbox" | "radio"
  options: DropdownOption[]
  children: React.ReactNode
  label?: string
  className?: string
  position?: "left" | "right" | "bottom" | "top"
  itemClassName?: string
}

export default function DropdownBox({
  label,
  type,
  options,
  name,
  children: menuTrigger,
  className,
  position = "bottom",
  itemClassName,
}: DropdownBoxProps) {
  const [field, meta, helpers] = useField<string[]>(name)
  const { value } = field
  const { setValue } = helpers

  const handleCheckboxChange = React.useCallback(
    (optionValue: string, checked: boolean) => {
      let newValue = [...value]
      if (checked) {
        newValue.push(optionValue)
      } else {
        newValue = newValue.filter((item) => item !== optionValue)
      }
      setValue(newValue)
    },
    [value, setValue],
  )

  const handleRadioChange = React.useCallback(
    (optionValue: string) => {
      setValue([optionValue])
    },
    [setValue],
  )

  return (
    <DropdownMenu modal={false}>
      <div>
        <DropdownMenuTrigger asChild>{menuTrigger}</DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className={`w-56 ${className}`} side={position}>
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        {type === "checkbox" &&
          options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={value.includes(option.value)}
              onCheckedChange={(checked) => handleCheckboxChange(option.value, checked)}
              disabled={option.disabled}
              className={cn("cursor-pointer", itemClassName)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}

        {type === "radio" && (
          <DropdownMenuRadioGroup value={value[0] || ""} onValueChange={handleRadioChange}>
            {options.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={cn("cursor-pointer", itemClassName)}
              >
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
