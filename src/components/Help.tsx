import { ReactNode } from "react"
import { cn } from "../lib/cn"

type HelpProps = {
  children: ReactNode | string
  className?: string
}

export default function Help({ children, className }: HelpProps) {
  return <div className={cn("text-xs text-primary/50", className)}>{children}</div>
}
