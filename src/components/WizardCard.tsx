import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "../lib/cn"
import { Card, CardContent, CardHeader, CardTitle } from "../primitives/card"
import type { WizardItem } from "../types"

type WizardCardProps = {
  item: WizardItem
  className?: string
}

export default function WizardCard({ item, className }: WizardCardProps) {
  return (
    <Link href={item.href} className="group block">
      <Card
        className={cn(
          "relative h-44 w-full md:w-72 transition-all duration-300 ease-in-out overflow-hidden",
          "hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10",
          "border-2 hover:border-primary/50",
          "bg-gradient-to-br from-background via-background to-muted/30",
          className,
        )}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className="space-y-0 pb-2 relative">
          <div className="flex items-start justify-between">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-primary/90 to-primary p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <item.icon className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
          </div>

          <CardTitle className="text-xl font-bold pt-2 group-hover:text-primary transition-colors duration-300">
            {item.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </CardContent>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </Card>
    </Link>
  )
}
