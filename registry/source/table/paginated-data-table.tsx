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
  type Updater,
  type VisibilityState,
  useReactTable,
} from "@tanstack/react-table"
import * as React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import type { DataTableProps } from "./data-table"
import type { TableActions, TableMultiRowAction } from "./data-table.types"
import { formatTableFilters } from "./data-table-utils"
import type { FilterDef } from "./filters"

export type PaginatedData<TData> = {
  results: TData[]
  count: number
  page_size: number
}

export type Pagination = {
  page: number
  page_size: number
  setPage: (value: number) => void
  setPageSize: (value: number) => void
  query: string
}

export type TableActionsProps = TableActions

export type PaginatedDataTableProps<TData, TValue> = Omit<DataTableProps<TData, TValue>, "data"> & {
  paginatedData: PaginatedData<TData>
  pagination?: Pagination
  filtersDef?: FilterDef[]
  resetFilters?: () => void
  onFilterChange?: (filters: Record<string, unknown>) => void
  isLoading?: boolean
  isFetching?: boolean
  multiRowActions?: TableMultiRowAction<TData>[]
  tableActions?: TableActions
  displayPaginationUI?: boolean
}

export function PaginatedDataTable<TData, TValue>({
  columns,
  searchFilter,
  filtersDef,
  resetFilters,
  paginatedData,
  pagination,
  multiRowActions,
  className,
  tableRowClassName,
  tableCellClassName,
  rowLinkClassName,
  onRowClick,
  onRowLinkClick,
  onFilterChange,
  isLoading = false,
  isFetching = false,
  tableActions,
  displayPaginationUI = true,
}: PaginatedDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const savedScrollTop = React.useRef(0)

  React.useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      savedScrollTop.current = container.scrollTop
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  React.useLayoutEffect(() => {
    savedScrollTop.current = 0
  }, [pagination?.page, pagination?.page_size])

  React.useLayoutEffect(() => {
    const container = scrollContainerRef.current
    if (!container || isLoading) return
    container.scrollTop = savedScrollTop.current
  }, [isLoading, paginatedData])

  const pageCount = Math.max(
    1,
    Math.ceil(paginatedData.count / Math.max(1, paginatedData.page_size)),
  )

  const table = useReactTable({
    data: paginatedData.results,
    columns,
    pageCount,
    manualPagination: Boolean(pagination),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      ...(pagination
        ? {
            pagination: {
              pageIndex: pagination.page - 1,
              pageSize: pagination.page_size,
            },
          }
        : {}),
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater: Updater<ColumnFiltersState>) => {
      const nextFilters = typeof updater === "function" ? updater(columnFilters) : updater
      setColumnFilters(nextFilters)
      onFilterChange?.(formatTableFilters(nextFilters))
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: (updater) => {
      if (!pagination) return

      const currentPagination = table.getState().pagination
      const nextPagination =
        typeof updater === "function" ? updater(currentPagination) : updater

      pagination.setPage(nextPagination.pageIndex + 1)
      pagination.setPageSize(nextPagination.pageSize)
    },
  })

  const getRowClassName = (row: TData) =>
    typeof tableRowClassName === "function" ? tableRowClassName(row) : tableRowClassName

  return (
    <div className={cn("relative flex flex-col gap-4", className)} aria-busy={isLoading || isFetching}>
      <DataTableToolbar
        table={table}
        searchFilter={searchFilter}
        filtersDef={filtersDef}
        resetFilters={resetFilters}
        multiRowActions={multiRowActions}
        tableActions={tableActions}
      />
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <span
              role="status"
              aria-label="Loading"
              className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
            />
          </div>
        )}
        {isFetching && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse bg-primary"
          />
        )}
        <div
          ref={scrollContainerRef}
          className="relative max-h-[calc(80vh-220px)] min-h-[400px] overflow-x-auto overflow-y-auto rounded-md border md:max-h-[calc(80dvh-200px)]"
        >
          <div className="relative min-w-full w-fit">
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
                {table.getRowModel().rows.length > 0
                  ? table.getRowModel().rows.map((row) => (
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
                            <TableCell
                              key={cell.id}
                              className={cn(
                                onRowLinkClick ? "p-0" : "py-2",
                                tableCellClassName,
                              )}
                            >
                              {linkHref ? (
                                <a
                                  href={linkHref}
                                  className={cn("flex h-full w-full items-center px-2 py-2", rowLinkClassName)}
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
                  : !isLoading && (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {!isLoading && displayPaginationUI && pagination && <DataTablePagination table={table} />}
    </div>
  )
}

export type { TableAction, TableActions, TableActionsOptions, TableMultiRowAction } from "./data-table.types"
export type { DataTableProps } from "./data-table"
