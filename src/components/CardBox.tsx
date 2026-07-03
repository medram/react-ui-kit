import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../primitives/card"

type CardBoxProps = {
  children: ReactNode
  title?: string
  description?: string
  className?: string
}

export default function CardBox({ children, title, description, className }: CardBoxProps) {
  return (
    <Card className={className}>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
