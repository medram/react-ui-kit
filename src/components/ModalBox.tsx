import { ReactNode, useState } from "react"
import { cn } from "../lib/cn"
import { Button } from "../primitives/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../primitives/dialog"

export type ModalBoxProps = {
  title?: string
  description?: string
  children?: ReactNode
  // control the trigger buttons
  trigger?: ReactNode
  closeButtonText?: string
  // classnames
  headerClassName?: string
  triggerClassName?: string
  contentClassName?: string
  footerClassName?: string
  // footer flag
  disabledFooter?: boolean
  // Modal props
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  width?: string | number
  height?: string | number
}

export default function ModalBox({
  title,
  description,
  children,
  // control the trigger buttons
  trigger,
  closeButtonText = "Close",
  // classnames
  headerClassName,
  triggerClassName,
  contentClassName,
  footerClassName,
  // footer flag
  disabledFooter = false,
  // Modal props
  isOpen = false,
  onOpenChange,
}: ModalBoxProps) {
  const [_isOpen, setIsOpen] = useState(!!isOpen)

  return (
    <Dialog
      open={_isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen)
        onOpenChange?.(isOpen)
      }}
    >
      {trigger && (
        <DialogTrigger asChild className={triggerClassName}>
          {trigger}
        </DialogTrigger>
      )}

      <DialogContent className={cn("max-w-[85vw] sm:max-w-xl ", contentClassName)}>
        <DialogHeader className={headerClassName}>
          <DialogTitle className={cn(title ? "" : "hidden")}>{title}</DialogTitle>
          <DialogDescription className={cn(description ? "" : "hidden")}>
            {description}
          </DialogDescription>
        </DialogHeader>

        {children}

        {!disabledFooter && (
          <DialogFooter className={cn("sm:justify-end", footerClassName)}>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {closeButtonText}
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
