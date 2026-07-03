import { ReactNode } from "react"
import { cn } from "../lib/cn"
import { Button } from "../primitives/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../primitives/sheet"
import { Prettify } from "../types"

type SheetSideType = "bottom" | "top" | "right" | "left"

type SheetBoxProps = Prettify<
  React.ComponentProps<typeof Sheet> & {
    trigger: ReactNode
    children?: ReactNode
    title?: string
    subTitle?: string
    side?: SheetSideType
    className?: string

    closeButtonText?: string
    // Footer content
    footer?: ReactNode
    disableFooter?: boolean
  }
>

export default function SheetBox({
  trigger,
  children,
  title,
  subTitle,
  side = "right",
  className,

  closeButtonText = "Close",
  // Footer content
  disableFooter = true,
  footer,
  ...sheetProps
}: SheetBoxProps) {
  return (
    <Sheet {...sheetProps}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side={side} className={className}>
        <SheetHeader>
          <SheetTitle className={cn(title ? "" : "hidden")}>{title}</SheetTitle>

          <SheetDescription className={cn(subTitle ? "p-2" : "hidden")}>
            {subTitle}
          </SheetDescription>
        </SheetHeader>

        {children}

        {!disableFooter && (
          <SheetFooter>
            {footer ? (
              footer
            ) : (
              <SheetClose asChild>
                <Button type="button">{closeButtonText}</Button>
              </SheetClose>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
