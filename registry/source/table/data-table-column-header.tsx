import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react"
import type { HTMLAttributes } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Column } from "@tanstack/react-table"

type DataTableColumnHeaderProps<TData, TValue> = HTMLAttributes<HTMLDivElement> & {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={cn("whitespace-nowrap text-[0.8rem]", className)}>{title}</span>
  }

  const sorted = column.getIsSorted()

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting()}
      >
        <span>{title}</span>
        {sorted === "desc" ? (
          <ArrowDown data-icon="inline-end" />
        ) : sorted === "asc" ? (
          <ArrowUp data-icon="inline-end" />
        ) : (
          <ArrowDownUp data-icon="inline-end" />
        )}
      </Button>
    </div>
  )
}
