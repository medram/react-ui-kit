import type { ComponentProps } from "react"

export default function FormError({ children, ...props }: ComponentProps<"p">) {
  return (
    <p role="alert" className="mt-2 text-sm text-destructive" {...props}>
      {children}
    </p>
  )
}
