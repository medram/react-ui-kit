import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import type { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DataTablePaginationProps<TData> = {
  table: Table<TData>
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const pagination = table.getState().pagination
  const pageCount = Math.max(1, table.getPageCount())
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const filteredCount = table.getFilteredRowModel().rows.length

  return (
    <div className="flex flex-col items-start justify-between gap-3 px-2 lg:flex-row lg:items-center">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedCount
          ? `${selectedCount} of ${filteredCount} item(s) selected.`
          : `${filteredCount} item(s).`}
      </div>
      <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Items per page</p>
          <Select
            value={`${pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 40, 50, 75, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[100px] text-sm font-medium">
          Page {pagination.pageIndex + 1} of {pageCount}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft aria-hidden="true" />
            <span className="sr-only">Go to first page</span>
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft aria-hidden="true" />
            <span className="sr-only">Go to previous page</span>
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight aria-hidden="true" />
            <span className="sr-only">Go to next page</span>
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight aria-hidden="true" />
            <span className="sr-only">Go to last page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
