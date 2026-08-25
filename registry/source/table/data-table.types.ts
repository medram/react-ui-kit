import type { Row } from "@tanstack/react-table"
import type { ComponentType } from "react"

export type SearchFilter = {
  accessorKey: string
  placeholder?: string
  onChangeHandler?: (value: string) => void
}

export type TableRowAction<TData> = {
  label: string
  clickHandler: (row: Row<TData>) => void | Promise<void>
  Icon?: ComponentType<{ className?: string }>
  hide?: boolean | ((args: { row: Row<TData> }) => boolean)
  /** @deprecated Use `hide` instead. */
  notAllowed?: boolean | ((args: { row: Row<TData> }) => boolean)
  hidden?: boolean | ((args: { row: Row<TData> }) => boolean)
}

export type TableMultiRowAction<TData> = {
  label: string
  clickHandler: (rows: Row<TData>[]) => void | Promise<void>
  Icon?: ComponentType<{ className?: string }>
  hide?: boolean
  /** @deprecated Use `hide` instead. */
  notAllowed?: boolean
}

export type TableAction = {
  label: string
  handler?: () => void | Promise<void>
  icon?: ComponentType<{ className?: string }>
  hidden?: boolean
  className?: string
}

export type TableActionsOptions = {
  label?: string
  icon?: ComponentType<{ className?: string }>
  style?: "dropdown" | "inline"
}

export type TableActions = {
  options?: TableActionsOptions
  actions: TableAction[]
}
