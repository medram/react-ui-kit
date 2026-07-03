import { LucideProps } from "lucide-react"
import { useState } from "react"
import { cn } from "../lib/cn"
import { TriggerModal } from "../modal/modal.hook"
import { Button } from "../primitives/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu"
import Loader from "./Loader"

// Local equivalent of the host app's table TableActionsOptionsProps, so the
// package owns its contract instead of reaching into dashboard/table.
type TableActionsOptionsProps = {
  label?: string
  icon?: React.ForwardRefExoticComponent<any>
  style?: "dropdown" | "inline"
}

export type DropDownButtonsItem = {
  label: string
  handler?: () => Promise<void>
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >
  hidden?: boolean
  className?: string
}

type DropDownButtonsProps = {
  actions: DropDownButtonsItem[]
} & TableActionsOptionsProps

export default function DropDownButtons({
  label,
  icon: TriggerIcon,
  actions,
  style = "dropdown",
}: DropDownButtonsProps) {
  const [isLoading, setIsLoading] = useState<{ index: number; state: boolean }>({
    index: -1,
    state: false,
  })
  const clickHandler = (index: number, handler: () => Promise<void>) => {
    setIsLoading({ index, state: true })
    handler().finally(() => setIsLoading({ index, state: false }))
  }
  return (
    <>
      {style === "dropdown" && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild disabled={isLoading.state}>
            <Button variant="outline" className="h-8 w-full">
              {isLoading.state ? (
                <Loader size={6} />
              ) : (
                TriggerIcon && <TriggerIcon className="h-4 w-4" />
              )}
              {!isLoading.state && label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {actions.map(({ label, handler, icon: ItemIcon, hidden, className }, i) => {
              if (hidden) return null
              return (
                <TriggerModal
                  onClick={() => (handler ? clickHandler(i, handler) : null)}
                  key={label}
                  variant="ghost"
                  className="w-full items-start flex flex-col"
                >
                  <DropdownMenuItem className={cn("gap-2 cursor-pointer", className)}>
                    {ItemIcon ? <ItemIcon className="h-4 w-4" /> : null}
                    {label}
                  </DropdownMenuItem>
                </TriggerModal>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {style === "inline" && (
        <div className="flex gap-2">
          {actions.map(({ label, handler, icon: ItemIcon, hidden, className }, i) => {
            if (hidden) return null
            return (
              <TriggerModal
                key={label}
                variant="outline"
                className={cn("h-8", className)}
                disabled={isLoading.state && isLoading.index === i}
                onClick={(e) => (handler ? clickHandler(i, handler) : null)}
              >
                {isLoading.state && isLoading.index === i ? (
                  <Loader size={6} />
                ) : (
                  <>
                    {ItemIcon && <ItemIcon className="h-4 w-4" />}
                    {label}
                  </>
                )}
              </TriggerModal>
            )
          })}
        </div>
      )}
    </>
  )
}
