import { ChevronDown, LoaderCircle } from "lucide-react"
import { useState } from "react"
import type { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { TableMultiRowAction } from "./data-table.types"

type DataTableMultiRowActionsProps<TData> = {
  rows: Row<TData>[]
  actions: TableMultiRowAction<TData>[]
}

export function DataTableMultiRowActions<TData>({
  rows,
  actions,
}: DataTableMultiRowActionsProps<TData>) {
  const [pending, setPending] = useState<number | null>(null)
  const visibleActions = actions.filter((action) => !(action.hide ?? action.notAllowed))

  if (visibleActions.length === 0) return null

  async function runAction(index: number) {
    const action = visibleActions[index]
    setPending(index)
    try {
      await action.clickHandler(rows)
    } finally {
      setPending(null)
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild disabled={pending !== null}>
        <Button variant="outline" className="h-8 gap-2 px-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-muted px-1 text-xs">
            {rows.length}
          </span>
          <span>item(s)</span>
          {pending !== null ? <LoaderCircle className="animate-spin" /> : <ChevronDown />}
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {visibleActions.map((action, index) => {
          const ActionIcon = action.Icon
          return (
            <DropdownMenuItem
              key={action.label}
              onSelect={() => {
                void runAction(index)
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
