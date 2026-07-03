import React, { ReactNode } from "react"

export default function FormError({
  children,
}: {
  children?: (message: string) => React.ReactNode
}) {
  return <p className="text-red-600 text-sm mt-2"> {children as ReactNode}</p>
}
