import { useTheme } from "next-themes"
import { cn } from "../lib/cn"
import { Badge, BadgeProps } from "../primitives/badge"
import { generateColorsFromString } from "../utils"

type CustomBadgeProps = BadgeProps & {
  type?: "default" | "warning" | "success" | "danger" | "random"
  intensity?: number // used for random type only for tweaking the result
}

export default function CustomBadge({
  children,
  type,
  intensity,
  className,
  ...props
}: CustomBadgeProps) {
  const { theme, systemTheme } = useTheme()
  className = "text-nowrap " + className

  switch (type) {
    case "default":
      return (
        <Badge variant="secondary" className={className} {...props}>
          {children}
        </Badge>
      )
    case "warning":
      return (
        <Badge
          variant="secondary"
          className={cn(
            `bg-yellow-200 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-200 hover:bg-yellow-200 hover:text-yellow-700 dark:hover:bg-yellow-700 dark:hover:text-yellow-200`,
            className,
          )}
          {...props}
        >
          {children}
        </Badge>
      )
    case "success":
      return (
        <Badge
          variant="secondary"
          className={cn(
            `bg-green-200 text-green-700 dark:bg-green-700 dark:text-green-200 hover:bg-green-200 hover:text-green-700 dark:hover:bg-green-700 dark:hover:text-green-200`,
            className,
          )}
          {...props}
        >
          {children}
        </Badge>
      )
    case "danger":
      return (
        <Badge
          variant="secondary"
          className={cn(
            `bg-red-200 text-red-700 dark:bg-red-700 dark:text-red-200 hover:bg-red-200 hover:text-red-700 dark:hover:bg-red-700 dark:hover:text-red-200`,
            className,
          )}
          {...props}
        >
          {children}
        </Badge>
      )
    case "random":
      const normalizedChildren = typeof children === "string" ? children : String(children ?? "")
      const { shinyColor, vibrantColor } = generateColorsFromString(normalizedChildren, intensity)
      const isDarkMode = theme === "dark" || (systemTheme === "dark" && theme === "system")
      return (
        <Badge
          style={{
            backgroundColor: isDarkMode ? vibrantColor : shinyColor,
            color: isDarkMode ? shinyColor : vibrantColor,
          }}
          className={className}
          {...props}
        >
          {children}
        </Badge>
      )
    default:
      return (
        <Badge
          variant="secondary"
          className={cn(`bg-sky-200 text-sky-700 hover:bg-sky-200 hover:text-sky-700`, className)}
          {...props}
        >
          {children}
        </Badge>
      )
  }
}
