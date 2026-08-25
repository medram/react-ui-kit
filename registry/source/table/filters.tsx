import type { ClassNames, DateRange } from "react-day-picker"

export type TableFilterType = "text" | "select" | "date"
export type NumberOfMonths = 1 | 2

export type FilterDef = {
  type: TableFilterType
  accessorKey: string
  title: string
  defaultDateRange?: DateRange
  hide?: boolean | (() => boolean)
  /** @deprecated Use `hide` instead. */
  notAllowed?: boolean | (() => boolean)
  placeHolder?: string
  tooltip?: string
  options?: { label: string; value: string }[]
  onChange?: (value: string | null) => void
  onDateSelectChange?: (date: DateRange) => void
  debounce?: number
  numberOfMonths?: NumberOfMonths
  classNames?: Partial<ClassNames>
  yearsRange?: number
  yearsOrder?: "asc" | "desc"
  minYear?: number
  maxYear?: number
  preventFuture?: boolean
  defaultToCurrentMonthYear?: boolean
}
