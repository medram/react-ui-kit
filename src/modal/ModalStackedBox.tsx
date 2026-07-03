"use client"

import { ReactNode } from "react"
import { cn } from "../lib/cn"
import { DialogHeader } from "../primitives/dialog"
import {
  DialogStack,
  DialogStackBody,
  DialogStackContent,
  DialogStackDescription,
  DialogStackOverlay,
  DialogStackTitle,
  DialogStackTrigger,
} from "./StackedDialog"

export type ModalStackBoxProps = {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  children?: ReactNode
  contentClassName?: string
  headerClassName?: string
  trigger?: ReactNode
  showOverlay?: boolean
}

export function ModalStackedBox({
  isOpen,
  children,
  title,
  description,
  onOpenChange,
  contentClassName,
  headerClassName,
  showOverlay = false,
  trigger,
}: ModalStackBoxProps) {
  return (
    <DialogStack
      open={isOpen}
      onOpenChange={(openState) => {
        if (isOpen && !openState) {
          onOpenChange?.(false)
        }
      }}
    >
      {showOverlay && <DialogStackOverlay />}
      {trigger && <DialogStackTrigger asChild>{trigger}</DialogStackTrigger>}
      <DialogStackBody>
        <DialogStackContent
          className={cn(
            "bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto",
            contentClassName,
          )}
        >
          <DialogHeader className={cn("flex flex-col gap-2 mb-4", headerClassName)}>
            <DialogStackTitle className={cn(title ? "" : "hidden", headerClassName)}>
              {title}
            </DialogStackTitle>
            <DialogStackDescription className={cn(description ? "" : "hidden")}>
              {description}
            </DialogStackDescription>
          </DialogHeader>
          {children}
        </DialogStackContent>
      </DialogStackBody>
    </DialogStack>
  )
}
