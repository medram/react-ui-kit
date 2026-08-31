const randomColors = [
  ["rgb(226, 232, 240)", "rgb(71, 85, 105)"],
  ["rgb(167, 243, 208)", "rgb(5, 150, 105)"],
  ["rgb(245, 208, 254)", "rgb(192, 38, 211)"],
  ["rgb(153, 246, 228)", "rgb(13, 148, 136)"],
  ["rgb(254, 202, 202)", "rgb(220, 38, 38)"],
] as const

const formatterCache = new Map<string, Intl.NumberFormat>()

export function formatCurrency(amount: number, locales = "fr-FR"): string {
  const key = locales
  let formatter = formatterCache.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locales, { maximumFractionDigits: 2 })
    formatterCache.set(key, formatter)
  }
  return formatter.format(amount)
}

export function generateColorsFromString(value: string, intensity = 1) {
  const seed = Array.from(String(value ?? "")).reduce((total, char) => total + char.charCodeAt(0), 0)
  const palette = randomColors[Math.abs(seed * Math.min(Math.max(intensity, 1), 10)) % randomColors.length]
  return { shinyColor: palette[0], vibrantColor: palette[1] }
}

export function convertTimetoDate(time: string) {
  const [hour, minute] = time.split(":")
  const date = new Date()
  date.setHours(Number(hour), Number(minute), 0, 0)
  return date
}

export const AVAILABLE_TIMEZONES_OPTIONS = ["UTC", ...Intl.supportedValuesOf("timeZone")]
  .filter((zone) => zone !== "Asia/Jerusalem")
  .map((zone) => ({ label: zone, value: zone }))
