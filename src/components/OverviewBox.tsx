import { CircleAlert, LucideIcon, TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "../lib/cn"
import { Card, CardContent, CardHeader, CardTitle } from "../primitives/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "../primitives/tooltip"
import { DotPattern } from "./DotPattern"
import { NumberTicker } from "./NumberTicker"

type OverviewBoxProps = {
  className?: string
  title?: string
  value?: React.ReactNode
  change?: number
  description?: React.ReactNode
  icon?: LucideIcon
  additionalInfo?: React.ReactNode
}

function getChangeLabel(change: number) {
  if (change > 0) {
    return (
      <span className="flex justify-center items-center gap-1 rounded-lg px-2 py-1 text-green-900 dark:text-green-200 text-xs bg-green-200 dark:bg-green-900 font-medium text-nowrap">
        <span>
          +<NumberTicker value={change} className="text-green-900" />%
        </span>{" "}
        <TrendingUp size={16} />
      </span>
    )
  }
  if (change < 0) {
    return (
      <span className="flex justify-center items-center gap-1 rounded-lg px-2 py-1 text-red-900 dark:text-red-200 text-xs bg-red-200 dark:bg-red-900 font-medium text-nowrap">
        <span>
          <NumberTicker value={change} className="text-red-900" />%
        </span>{" "}
        <TrendingDown size={16} />
      </span>
    )
  }
  return (
    <span className="flex justify-center items-center rounded-lg px-2 py-1 text-gray-900 dark:text-gray-200 text-xs bg-gray-200 dark:bg-gray-900 font-medium text-nowrap">
      N/A
    </span>
  )
}

export default function OverviewBox({
  className,
  title,
  value,
  change,
  description,
  icon: Icon,
  additionalInfo,
}: OverviewBoxProps) {
  return (
    <DotPattern
      className={cn(
        "[mask-image:radial-gradient(200px_circle_at_center,white,transparent)] p-1 h-full",
      )}
    >
      <Card className={cn("h-[140px] relative bg-transparent", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {title && (
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              {title}{" "}
              {additionalInfo && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CircleAlert size={18} className="opacity-50 hover:opacity-80" />
                  </TooltipTrigger>
                  <TooltipContent side="right">{additionalInfo}</TooltipContent>
                </Tooltip>
              )}
            </CardTitle>
          )}
          {Icon && <Icon className="text-primary" />}
        </CardHeader>
        <CardContent>
          {value && <div className="text-2xl font-bold">{value}</div>}

          <div className="flex justify-between items-center space-x-2 mt-2">
            {description && <span className="text-xs text-primary">{description}</span>}
            {change != undefined && getChangeLabel(change)}
          </div>
        </CardContent>
      </Card>
    </DotPattern>
  )
}
