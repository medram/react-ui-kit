"use client"

import { useEffect, useRef, useState } from "react"

import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

type InputFilterProps = {
  onChange: (value: string | null) => void
  debounce: number
  accessorKey: string
  placeholder?: string
  tooltip?: string
  defaultValue?: string
  className?: string
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), Math.max(0, delay))
    return () => clearTimeout(timeout)
  }, [delay, value])

  return debouncedValue
}

export function InputFilter({
  onChange,
  debounce,
  accessorKey,
  placeholder,
  tooltip,
  className,
  defaultValue,
}: InputFilterProps) {
  const [inputValue, setInputValue] = useState(defaultValue ?? "")
  const debouncedValue = useDebouncedValue(inputValue, debounce)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    onChangeRef.current(debouncedValue || null)
  }, [debouncedValue])

  useEffect(() => {
    setInputValue(defaultValue ?? "")
  }, [defaultValue])

  const inputElement = (
    <Input
      key={accessorKey}
      placeholder={placeholder ?? `Search by ${accessorKey}...`}
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      className={cn("h-8 w-[150px] lg:w-[250px]", className)}
    />
  )

  if (!tooltip) return inputElement

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{inputElement}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

type FacetedFilterProps = {
  onChange: (value: string | null) => void
  title: string
  options: { value: string; label: string }[]
  value: string | null
  accessorKey: string
}

export function FacetedFilter({
  onChange,
  title,
  options,
  value,
  accessorKey,
}: FacetedFilterProps) {
  return (
    <DataTableFacetedFilter
      key={accessorKey}
      title={title}
      options={options}
      value={value}
      onChange={onChange}
    />
  )
}
