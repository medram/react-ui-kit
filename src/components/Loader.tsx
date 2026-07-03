import { useTheme } from "next-themes"
import { PulseLoader } from "react-spinners"

type LoaderProps = {
  themeColors?: { dark: string; light: string }
  size?: number
  speedMultiplier?: number
  color?: string
}

export default function Loader({
  themeColors = { dark: "#ffffff", light: "#0f172a" },
  size = 12,
  speedMultiplier = 0.8,
  color,
}: LoaderProps) {
  const { theme, systemTheme } = useTheme()
  const isDarkMode = theme === "dark" || (systemTheme === "dark" && theme === "system")

  return (
    <PulseLoader
      color={color ? color : isDarkMode ? themeColors.dark : themeColors.light}
      speedMultiplier={speedMultiplier}
      size={size}
    />
  )
}
