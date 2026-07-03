"use client"

import { useMemo, useState } from "react"
import SelectInput, { SelectOptions } from "../inputs/SelectInput"
import { cn } from "../lib/cn"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../primitives/card"

export type BaseChartCardCtx<T> = {
  selectedOption: T extends number | string ? SelectOptions<T> : null
  optionIndex: T extends number | string ? number : null
}

// A header/footer slot accepts either a static node or a function that derives
// it from the currently selected option. The function form lets charts surface
// per-option titles without mirroring props into state via useEffect.
export type ChartSlot<T> = React.ReactNode | ((ctx: BaseChartCardCtx<T>) => React.ReactNode)

type BaseChartCardProps<T> = {
  headerTitle?: ChartSlot<T>
  headerTitleClassName?: string
  headerDescription?: ChartSlot<T>
  headerDescriptionClassName?: string
  footerTitle?: ChartSlot<T>
  footerTitleClassName?: string
  footerDescription?: ChartSlot<T>
  footerDescriptionClassName?: string
  className?: string
  chartContainerClassName?: string
  footerClassName?: string
  headerClassName?: string
  children?: React.ReactNode | ((ctx: BaseChartCardCtx<T>) => React.ReactNode)
  options?: SelectOptions<T>[]
  contentClassName?: string
}

function resolve<T>(slot: ChartSlot<T> | undefined, ctx: BaseChartCardCtx<T>): React.ReactNode {
  return typeof slot === "function" ? slot(ctx) : slot
}

export function BaseChartCard<T extends number | string>({
  headerTitle,
  headerTitleClassName,
  headerDescription,
  headerDescriptionClassName,
  footerTitle,
  footerTitleClassName,
  footerDescription,
  footerDescriptionClassName,
  className,
  children,
  options,
  contentClassName = "",
  footerClassName,
  headerClassName,
}: BaseChartCardProps<T>) {
  const [selectedOption, setSelectedOption] = useState<SelectOptions<T> | null>(
    options && options.length ? options[0] : null,
  )

  const optionIndex = useMemo(() => {
    const index = options?.findIndex((option) => option.value === selectedOption?.value)
    if (index === undefined || index === -1) return null
    return index
  }, [options, selectedOption])

  const ctx = {
    selectedOption: selectedOption as BaseChartCardCtx<T>["selectedOption"],
    optionIndex: optionIndex as BaseChartCardCtx<T>["optionIndex"],
  }

  const resolvedHeaderTitle = resolve(headerTitle, ctx)
  const resolvedHeaderDescription = resolve(headerDescription, ctx)
  const resolvedFooterTitle = resolve(footerTitle, ctx)
  const resolvedFooterDescription = resolve(footerDescription, ctx)

  return (
    <Card className={cn("relative flex flex-col", className)}>
      <CardHeader className={cn("sm:flex-row-reverse gap-3 justify-between flex-nowrap")}>
        {options && options.length > 1 && (
          <SelectInput
            options={options}
            value={selectedOption?.value.toString()}
            onChange={(value, selectedOption) => setSelectedOption(selectedOption)}
          />
        )}

        <div className={cn("flex-1", headerClassName)}>
          {resolvedHeaderTitle && (
            <CardTitle className={cn("mb-2", headerTitleClassName)}>
              {resolvedHeaderTitle}
            </CardTitle>
          )}
          {resolvedHeaderDescription && (
            <CardDescription className={headerDescriptionClassName}>
              {resolvedHeaderDescription}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn("flex-1 flex flex-col justify-center", contentClassName)}>
        {typeof children === "function" ? children(ctx) : children}
      </CardContent>

      {(resolvedFooterTitle || resolvedFooterDescription) && (
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className={cn("grid gap-2", footerClassName)}>
              {resolvedFooterTitle && (
                <div
                  className={cn(
                    "flex items-center gap-2 font-medium leading-none",
                    footerTitleClassName,
                  )}
                >
                  {resolvedFooterTitle}
                </div>
              )}
              {resolvedFooterDescription && (
                <div
                  className={cn(
                    "flex items-center gap-2 leading-none text-muted-foreground",
                    footerDescriptionClassName,
                  )}
                >
                  {resolvedFooterDescription}
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

// Shared Suspense fallback for lazily-loaded chart bodies. Matches the typical
// recharts container height to avoid layout shift while recharts loads.
export function ChartFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-[350px] w-full animate-pulse rounded-md bg-muted/50", className)}
      aria-hidden="true"
    />
  )
}
