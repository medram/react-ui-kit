"use client"

import type { ColumnDef, Row } from "@tanstack/react-table"
import { CircleCheck, CircleX } from "lucide-react"

import CopyButton from "@/components/ui/copy-button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import type { TableRowAction } from "./data-table.types"

type ColumnDefinitionBase<TData> = Omit<ColumnDef<TData>, "cell"> & {
  accessorKey: string
  title: string
  hide?: boolean | (() => boolean)
  /** @deprecated Use `hide` instead. */
  notAllowed?: boolean | (() => boolean)
}

type ColumnDefWithCell<TData> = ColumnDefinitionBase<TData> & {
  cell?: ColumnDef<TData>["cell"]
  enableCopy?: never
}

type ColumnDefWithCopy<TData> = ColumnDefinitionBase<TData> & {
  cell?: never
  enableCopy: boolean
}

type ColumnDefinition<TData> = ColumnDefWithCell<TData> | ColumnDefWithCopy<TData>

export type ColumnDefinitionsProps<TData> = {
  columnsDef: ColumnDefinition<TData>[]
  enableSelection?: boolean
  actions?: TableRowAction<TData>[]
}

function isColumnHidden<TData>(column: ColumnDefinition<TData>) {
  const hide = column.hide ?? column.notAllowed
  return typeof hide === "function" ? hide() : hide
}

function renderDefaultCell<TData>(
  row: Row<TData>,
  accessorKey: string,
  enableCopy: boolean | undefined,
) {
  const value = row.getValue(accessorKey)

  if (typeof value === "boolean") {
    return (
      <div className="py-1">
        {value ? <CircleCheck className="text-green-500" /> : <CircleX className="text-orange-500" />}
      </div>
    )
  }

  const displayValue = value === null || value === undefined || value === "" ? "-" : String(value)

  if (enableCopy && displayValue !== "-") {
    return (
      <div className="group flex items-center py-1">
        <span className="truncate">{displayValue}</span>
        <span className="opacity-0 transition-opacity group-hover:opacity-100">
          <CopyButton text={displayValue} />
        </span>
      </div>
    )
  }

  return <div className="py-1">{displayValue}</div>
}

export default function generateColumnsDefinition<TData>({
  columnsDef,
  enableSelection = false,
  actions,
}: ColumnDefinitionsProps<TData>) {
  const columns: ColumnDef<TData>[] = []

  if (enableSelection) {
    columns.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(event) => event.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    })
  }

  columnsDef.forEach((columnDef) => {
    if (isColumnHidden(columnDef)) return

    const { title, enableCopy, ...column } = columnDef
    delete column.notAllowed
    delete column.hide
    const customCell = "cell" in columnDef ? columnDef.cell : undefined

    columns.push({
      ...column,
      header: ({ column: tableColumn }) => (
        <DataTableColumnHeader column={tableColumn} title={title} />
      ),
      cell: customCell ?? (({ row }) => renderDefaultCell(row, columnDef.accessorKey, enableCopy)),
    })
  })

  if (actions?.length) {
    columns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => <DataTableRowActions row={row} actions={actions} />,
    })
  }

  return columns
}
