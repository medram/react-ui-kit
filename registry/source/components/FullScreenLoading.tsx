import { useTheme } from "next-themes"
import { HashLoader } from "react-spinners"

export default function FullScreenLoading() {
  const { theme, systemTheme } = useTheme()

  const isDarkMode = theme === "dark" || (systemTheme === "dark" && theme === "system")

  return (
    <div
      className={`w-full h-full ${isDarkMode ? "" : "bg-slate-200"} absolute flex justify-center items-center`}
    >
      <HashLoader color="#888" />
    </div>
  )
}
