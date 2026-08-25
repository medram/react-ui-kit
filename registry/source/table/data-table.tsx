"use client"

import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
  useReactTable,
} from "@tanstack/react-table"
import * as React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import type { FilterDef } from "./filters"
import type { SearchFilter, TableActions, TableMultiRowAction } from "./data-table.types"

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  multiRowActions?: TableMultiRowAction<TData>[]
  searchFilter?: SearchFilter
  filtersDef?: FilterDef[]
  resetFilters?: () => void
  tableActions?: TableActions
  className?: string
  tableRowClassName?: string | ((row: TData) => string)
  tableCellClassName?: string
  rowLinkClassName?: string
  onRowClick?: (row: Row<TData>) => void
  onRowLinkClick?: (row: Row<TData>) => string
  hidePagination?: boolean
  isFetching?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  multiRowActions,
  searchFilter,
  filtersDef,
  resetFilters,
  tableActions,
  tableRowClassName,
  tableCellClassName,
  rowLinkClassName,
  hidePagination = false,
  onRowClick,
  onRowLinkClick,
  isFetching = false,
  className,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const getRowClassName = (row: TData) =>
    typeof tableRowClassName === "function" ? tableRowClassName(row) : tableRowClassName

  return (
    <div className="relative flex flex-col gap-4" aria-busy={isFetching}>
      <DataTableToolbar
        table={table}
        searchFilter={searchFilter}
        filtersDef={filtersDef}
        resetFilters={resetFilters}
        multiRowActions={multiRowActions}
        tableActions={tableActions}
      />
      <div
        className={cn(
          "relative min-h-[calc(80vh-120px)] max-h-[calc(80vh-220px)] overflow-y-auto rounded-md border md:max-h-[calc(80dvh-200px)]",
          className,
        )}
      >
        {isFetching && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse bg-primary"
          />
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    onRowClick || onRowLinkClick ? "cursor-pointer" : undefined,
                    getRowClassName(row.original),
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    const linkHref = onRowLinkClick?.(row)
                    const content = flexRender(cell.column.columnDef.cell, cell.getContext())

                    return (
                      <TableCell key={cell.id} className={cn("py-2", tableCellClassName)}>
                        {linkHref ? (
                          <a
                            href={linkHref}
                            className={cn("flex h-full w-full items-center", rowLinkClassName)}
                            onClick={(event) => event.stopPropagation()}
                          >
                            {content}
                          </a>
                        ) : (
                          content
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!hidePagination && <DataTablePagination table={table} />}
    </div>
  )
}

export type { SearchFilter, TableMultiRowAction, TableRowAction } from "./data-table.types"
export type { TableActions, TableAction, TableActionsOptions } from "./data-table.types"
