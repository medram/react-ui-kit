"use client"

import type { Table } from "@tanstack/react-table"
import { Menu, X } from "lucide-react"
import * as React from "react"
import type { DateRange } from "react-day-picker"

import { CalendarDatePicker } from "@/components/ui/calendar-date-picker"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableMultiRowActions } from "./data-table-multi-row-actions"
import { InputFilter } from "./data-table-filters"
import { DataTableViewOptions } from "./data-table-view-options"
import type {
  SearchFilter,
  TableAction,
  TableActions,
  TableMultiRowAction,
} from "./data-table.types"
import { useDebouncedCallback } from "./data-table-utils"
import type { FilterDef } from "./filters"

export type MultiSelectFilter = {
  accessorKey: string
  title: string
  options: {
    label: string
    value: string
    Icon?: React.ComponentType<{ className?: string }>
  }[]
}

export type filterElementsType = {
  searchInput?: SearchFilter
  multiSelectFilters?: MultiSelectFilter[]
}

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchFilter?: SearchFilter
  multiRowActions?: TableMultiRowAction<TData>[]
  filtersDef?: FilterDef[]
  resetFilters?: () => void
  tableActions?: TableActions
}

const EMPTY_FILTERS_DEF: FilterDef[] = []
const EMPTY_DATE_RANGE: DateRange = { from: undefined, to: undefined }

function isFilterHidden(filter: FilterDef) {
  const hide = filter.hide ?? filter.notAllowed
  return typeof hide === "function" ? hide() : hide
}

function TableActionsMenu({ tableActions }: { tableActions: TableActions }) {
  const [pendingIndex, setPendingIndex] = React.useState<number | null>(null)
  const visibleActions = tableActions.actions.filter((action) => !action.hidden)
  const style = tableActions.options?.style ?? "dropdown"
  const label = tableActions.options?.label ?? "Actions"
  const TriggerIcon = tableActions.options?.icon ?? Menu

  if (visibleActions.length === 0) return null

  async function runAction(index: number, action: TableAction) {
    if (!action.handler) return

    setPendingIndex(index)
    try {
      await action.handler()
    } finally {
      setPendingIndex(null)
    }
  }

  if (style === "inline") {
    return (
      <div className="flex items-center gap-2">
        {visibleActions.map((action, index) => {
          const ActionIcon = action.icon
          const isPending = pendingIndex === index
          return (
            <Button
              key={action.label}
              variant="outline"
              className={action.className}
              disabled={pendingIndex !== null}
              onClick={() => {
                void runAction(index, action)
              }}
            >
              {isPending ? (
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                ActionIcon && <ActionIcon className="size-4" />
              )}
              {!isPending && action.label}
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild disabled={pendingIndex !== null}>
        <Button variant="outline" size="sm" className="h-8">
          {pendingIndex !== null ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <TriggerIcon className="size-4" />
          )}
          {pendingIndex === null && label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {visibleActions.map((action, index) => {
          const ActionIcon = action.icon
          return (
            <DropdownMenuItem
              key={action.label}
              className={action.className}
              onSelect={() => {
                void runAction(index, action)
              }}
            >
              {ActionIcon && <ActionIcon className="size-4" />}
              {action.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SelectFilter<TData>({ table, filter }: { table: Table<TData>; filter: FilterDef }) {
  const updateValue = React.useCallback(
    (value: string | null) => {
      if (filter.onChange) {
        filter.onChange(value)
        return
      }

      table.getColumn(filter.accessorKey)?.setFilterValue(value ?? undefined)
    },
    [filter, table],
  )
  const debouncedUpdate = useDebouncedCallback(updateValue, filter.debounce ?? 1000)
  const onChange = filter.onChange ? debouncedUpdate : updateValue
  const value = filter.onChange
    ? filter.defaultValue ?? null
    : ((table.getColumn(filter.accessorKey)?.getFilterValue() as string | undefined) ?? null)

  return (
    <DataTableFacetedFilter
      title={filter.title}
      options={filter.options ?? []}
      value={value}
      onChange={onChange}
    />
  )
}

function DateFilter({
  filter,
  defaultsRef,
  today,
}: {
  filter: FilterDef
  defaultsRef: React.MutableRefObject<Record<string, DateRange>>
  today: Date
}) {
  if (filter.numberOfMonths === 1 && !defaultsRef.current[filter.accessorKey]) {
    defaultsRef.current[filter.accessorKey] =
      filter.defaultDateRange ??
      (filter.defaultToCurrentMonthYear ? { from: today, to: today } : EMPTY_DATE_RANGE)
  }

  const date =
    (filter.numberOfMonths === 1
      ? defaultsRef.current[filter.accessorKey]
      : filter.defaultDateRange ??
        (filter.defaultToCurrentMonthYear ? { from: today, to: today } : EMPTY_DATE_RANGE)) ?? EMPTY_DATE_RANGE
  return (
    <CalendarDatePicker
      suppressHydrationWarning
      date={date}
      variant="outline"
      onDateSelect={(range) => filter.onDateSelectChange?.(range)}
      placeholder={filter.placeHolder}
      enableWheel={false}
      className="w-full truncate px-2 md:text-xs"
      numberOfMonths={filter.numberOfMonths ?? 2}
      yearsRange={filter.yearsRange}
      yearsOrder={filter.yearsOrder}
      minYear={filter.minYear}
      maxYear={filter.maxYear}
      preventFuture={filter.preventFuture}
      classNames={
        filter.classNames ?? {
          caption_label: "hidden",
          button_previous: "hidden",
          button_next: "hidden",
        }
      }
    />
  )
}

export function DataTableToolbar<TData>({
  table,
  searchFilter,
  multiRowActions,
  filtersDef = EMPTY_FILTERS_DEF,
  resetFilters,
  tableActions,
}: DataTableToolbarProps<TData>) {
  const dateDefaultsRef = React.useRef<Record<string, DateRange>>({})
  const today = React.useMemo(() => new Date(), [])
  const isTableFiltered = table.getState().columnFilters.length > 0
  const hasDefaultFilters = filtersDef.some(
    (filter) => filter.defaultDateRange?.from || filter.defaultDateRange?.to || filter.defaultValue,
  )
  const resolvedMultiRowActions = multiRowActions ?? []

  return (
    <div className="flex flex-col-reverse items-start justify-between gap-4 lg:flex-row">
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {searchFilter && (
          <InputFilter
            accessorKey={searchFilter.accessorKey}
            debounce={300}
            defaultValue=""
            placeholder={searchFilter.placeholder}
            onChange={(value) => {
              if (searchFilter.onChangeHandler) {
                searchFilter.onChangeHandler(value ?? "")
              } else {
                table.getColumn(searchFilter.accessorKey)?.setFilterValue(value ?? undefined)
              }
            }}
          />
        )}
        {filtersDef.map((filter) => {
          if (isFilterHidden(filter)) return null

          if (filter.type === "text") {
            return (
              <InputFilter
                key={filter.accessorKey}
                accessorKey={filter.accessorKey}
                debounce={filter.debounce ?? 1000}
                defaultValue={filter.defaultValue}
                placeholder={filter.placeHolder}
                tooltip={filter.tooltip ?? filter.placeHolder}
                className="w-full truncate"
                onChange={(value) => {
                  if (filter.onChange) {
                    filter.onChange(value)
                  } else {
                    table.getColumn(filter.accessorKey)?.setFilterValue(value ?? undefined)
                  }
                }}
              />
            )
          }

          if (filter.type === "select") {
            return <SelectFilter key={filter.accessorKey} table={table} filter={filter} />
          }

          return (
            <DateFilter
              key={filter.accessorKey}
              filter={filter}
              defaultsRef={dateDefaultsRef}
              today={today}
            />
          )
        })}
        {(isTableFiltered || hasDefaultFilters) && (
          <Button
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => {
              dateDefaultsRef.current = {}
              if (isTableFiltered) table.resetColumnFilters()
              resetFilters?.()
            }}
          >
            Reset
            <X data-icon="inline-end" />
          </Button>
        )}
      </div>
      <div className="flex items-center justify-end gap-2 self-end lg:self-start">
        {resolvedMultiRowActions.length > 0 &&
          table.getFilteredSelectedRowModel().rows.length > 0 && (
            <DataTableMultiRowActions
              rows={table.getFilteredSelectedRowModel().rows}
              actions={resolvedMultiRowActions}
            />
          )}
        {tableActions && <TableActionsMenu tableActions={tableActions} />}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}

export type { DataTableToolbarProps }
