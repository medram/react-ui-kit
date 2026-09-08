import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { DialogHeader } from "@/components/ui/dialog"
import {
  DialogStack,
  DialogStackBody,
  DialogStackContent,
  DialogStackDescription,
  DialogStackOverlay,
  DialogStackTitle,
  DialogStackTrigger,
} from "@/components/ui/stacked-dialog"

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
            "max-w-[85vw] sm:max-w-xl max-h-[90vh] overflow-y-auto",
            contentClassName,
          )}
        >
          <DialogHeader className={headerClassName}>
            <DialogStackTitle className={cn(title ? "" : "hidden")}>
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
