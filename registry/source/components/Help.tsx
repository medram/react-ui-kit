import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

type HelpProps = ComponentProps<"p">

export default function Help({ children, className, ...props }: HelpProps) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}
