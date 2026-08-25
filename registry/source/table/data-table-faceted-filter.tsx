"use client"

import { Check, CirclePlus } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
export type DataTableFacetedFilterOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export type DataTableFacetedFilterProps = {
  title: string
  options: DataTableFacetedFilterOption[]
  onChange: (value: string | null) => void
  value: string | null
}

export function DataTableFacetedFilter({
  title,
  options,
  onChange,
  value,
}: DataTableFacetedFilterProps) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <TooltipProvider>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 max-w-full border-dashed">
                <CirclePlus data-icon="inline-start" />
                <span className="truncate">{title}</span>
                {selectedOption && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Badge variant="secondary" className="max-w-24 truncate">
                      {selectedOption.label}
                    </Badge>
                  </>
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{selectedOption?.label ?? title}</TooltipContent>
        </Tooltip>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const OptionIcon = option.icon
                  const selected = option.value === value

                  return (
                    <CommandItem
                      key={option.value}
                      value={`${option.label} ${option.value}`}
                      onSelect={() => onChange(selected ? null : option.value)}
                      className="cursor-pointer"
                    >
                      <span
                        className={cn(
                          "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                          selected ? "bg-primary text-primary-foreground" : "opacity-50",
                        )}
                      >
                        <Check className={cn("size-4", !selected && "invisible")} />
                      </span>
                      {OptionIcon && <OptionIcon className="mr-2 size-4 text-muted-foreground" />}
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              {value && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => onChange(null)}
                      className="justify-center text-center"
                    >
                      Clear filter
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
