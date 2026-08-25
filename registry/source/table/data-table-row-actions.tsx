"use client"

import { MoreHorizontal, LoaderCircle } from "lucide-react"
import { useState } from "react"
import type { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { TableRowAction } from "./data-table.types"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
  actions: TableRowAction<TData>[]
}

export function DataTableRowActions<TData>({ row, actions }: DataTableRowActionsProps<TData>) {
  const [pending, setPending] = useState(false)
  const visibleActions = actions.filter((action) => {
    const isHidden = typeof action.hidden === "function" ? action.hidden({ row }) : action.hidden
    const hide = action.hide ?? action.notAllowed
    const isHiddenByPermission = typeof hide === "function" ? hide({ row }) : hide
    return !isHidden && !isHiddenByPermission
  })

  if (visibleActions.length === 0) return null

  async function runAction(action: TableRowAction<TData>) {
    setPending(true)
    try {
      await action.clickHandler(row)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild disabled={pending}>
          <Button
            variant="ghost"
            className="size-8 p-0 data-[state=open]:bg-muted"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            {pending ? <LoaderCircle className="animate-spin" /> : <MoreHorizontal />}
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {visibleActions.map((action) => {
            const ActionIcon = action.Icon
            return (
              <DropdownMenuItem
                key={action.label}
                onSelect={() => {
                  void runAction(action)
                }}
              >
                {ActionIcon && <ActionIcon className="size-4" />}
                {action.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
