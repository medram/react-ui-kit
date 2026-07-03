import { CheckCircledIcon, ExclamationTriangleIcon, InfoCircledIcon } from "@radix-ui/react-icons"
import { cn } from "../lib/cn"
import { AlertDescription, AlertTitle } from "../primitives/alert"

import { IconProps } from "@radix-ui/react-icons/dist/types"

type AlertType = {
  title: string
  icon: React.ComponentType<IconProps>
  containerClassName: string
}

type AlertTypes = {
  info: AlertType
  warning: AlertType
  error: AlertType
  success: AlertType
}

const alertTypes: AlertTypes = {
  info: {
    title: "Info",
    icon: InfoCircledIcon,
    containerClassName: "text-blue-700 dark:text-blue-100 border-none bg-blue-100 dark:bg-blue-900",
  },
  warning: {
    title: "Warning",
    icon: ExclamationTriangleIcon,
    containerClassName:
      "text-yellow-700 dark:text-yellow-100 border-none bg-yellow-100 dark:bg-yellow-900",
  },
  error: {
    title: "Error",
    icon: ExclamationTriangleIcon,
    containerClassName: "text-red-700 dark:text-red-100 border-none bg-red-100 dark:bg-red-900",
  },
  success: {
    title: "Success",
    icon: CheckCircledIcon,
    containerClassName:
      "text-green-700 dark:text-green-300 border-none bg-green-100 dark:bg-green-900",
  },
}

type AlertBoxProps = {
  type?: "info" | "warning" | "error" | "success"
  title?: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export default function AlertBox({
  type = "info",
  title,
  description,
  className,
  children,
}: AlertBoxProps) {
  const alert = alertTypes[type]

  return (
    <div
      className={cn(
        `border p-4 rounded-md flex items-start ${alert.containerClassName} ${className}`,
      )}
    >
      <div className="mr-3">
        <alert.icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        {title && (
          <AlertTitle className={`font-bold ${!description && "p-0 mb-2"}`}>{title}</AlertTitle>
        )}
        {description && <AlertDescription>{description}</AlertDescription>}
        {children && <AlertDescription>{children}</AlertDescription>}
      </div>
    </div>
  )
}
