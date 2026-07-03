// Pure helpers lifted from the host app's src/utils, scoped to what @medram/ui
// components actually use. Verbatim behaviour to preserve parity.

type ColorPalette = {
  name: string
  "200": string
  "600": string
}

const RANDOM_COLORS: ColorPalette[] = [
  { name: "Slate", "200": "rgb(226, 232, 240)", "600": "rgb(71, 85, 105)" },
  { name: "Emerald", "200": "rgb(167, 243, 208)", "600": "rgb(5, 150, 105)" },
  { name: "Fuchsia", "200": "rgb(245, 208, 254)", "600": "rgb(192, 38, 211)" },
  { name: "Teal", "200": "rgb(153, 246, 228)", "600": "rgb(13, 148, 136)" },
  { name: "Rose", "200": "rgb(254, 205, 211)", "600": "rgb(225, 29, 72)" },
  { name: "Yellow", "200": "rgb(254, 240, 138)", "600": "rgb(202, 138, 4)" },
  { name: "Indigo", "200": "rgb(199, 210, 254)", "600": "rgb(67, 56, 202)" },
  { name: "Orange", "200": "rgb(254, 215, 170)", "600": "rgb(234, 88, 12)" },
  { name: "Sky", "200": "rgb(186, 230, 253)", "600": "rgb(2, 132, 199)" },
  { name: "Lime", "200": "rgb(217, 249, 157)", "600": "rgb(77, 124, 15)" },
  { name: "Violet", "200": "rgb(221, 214, 254)", "600": "rgb(109, 40, 217)" },
  { name: "Red", "200": "rgb(254, 202, 202)", "600": "rgb(220, 38, 38)" },
  { name: "Cyan", "200": "rgb(165, 243, 252)", "600": "rgb(8, 145, 178)" },
  { name: "Purple", "200": "rgb(233, 213, 255)", "600": "rgb(124, 58, 237)" },
  { name: "Pink", "200": "rgb(251, 207, 232)", "600": "rgb(219, 39, 119)" },
  { name: "Amber", "200": "rgb(253, 230, 138)", "600": "rgb(202, 138, 4)" },
  { name: "Coral", "200": "rgb(252, 192, 191)", "600": "rgb(244, 63, 94)" },
  { name: "Blue", "200": "rgb(191, 219, 254)", "600": "rgb(29, 78, 216)" },
  { name: "Peach", "200": "rgb(254, 215, 215)", "600": "rgb(237, 100, 166)" },
]

const _intlCache = new Map<string, Intl.NumberFormat>()

export function formatCurrency(
  amount: number,
  options: Intl.NumberFormatOptions & {
    locales?: string
  } = {},
): string {
  const {
    locales = "fr-FR",
    currency = "MAD",
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    ...restOptions
  } = options
  const key = `${locales}|${currency}|${minimumFractionDigits}|${maximumFractionDigits}|${JSON.stringify(restOptions)}`
  let formatter = _intlCache.get(key)
  if (!formatter) {
    // react-doctor-disable-next-line react-doctor/js-hoist-intl -- formatter is cached in module-scope _intlCache; only runs on first miss per key
    formatter = new Intl.NumberFormat(locales, {
      style: "decimal",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping: true,
      ...restOptions,
    })
    _intlCache.set(key, formatter)
  }
  return formatter.format(amount)
}

export function generateColorsFromString(str: string, intensity: number = 1) {
  const normalizedStr = String(str ?? "")

  // Ensure intensity is within the 1-10 range
  const adjustedIntensity = Math.min(Math.max(intensity, 1), 10)

  // Use the string length and intensity to create a base value
  const baseValue = normalizedStr.length * adjustedIntensity

  // Combine the base value with a unique seed from the string content
  const uniqueSeed = normalizedStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Calculate the final index and ensure it is an integer inside bounds
  const rawIndex = (baseValue + uniqueSeed) % RANDOM_COLORS.length
  const colorIndex = Math.abs(Math.floor(rawIndex)) % RANDOM_COLORS.length
  const colorPalette = RANDOM_COLORS[colorIndex] ||
    RANDOM_COLORS[0] || {
      "200": "rgb(226, 232, 240)",
      "600": "rgb(71, 85, 105)",
    }

  return {
    vibrantColor: colorPalette["600"],
    shinyColor: colorPalette["200"],
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Converts a string in the format "HH:MM" to a Date object where the year,
 * month and day are the current date and the hours/minutes are the parsed values.
 */
export function convertTimetoDate(time: string) {
  const [hour, minute] = time.split(":")
  const date = new Date()
  date.setHours(Number(hour), Number(minute), 0, 0)
  return date
}

function getAvailableTimezones() {
  return ["UTC"].concat(Intl.supportedValuesOf("timeZone"))
}

function getAvailableTimezonesOptionList() {
  return getAvailableTimezones().flatMap((zone) =>
    zone === "Asia/Jerusalem" ? [] : [{ label: zone, value: zone }],
  )
}

export const AVAILABLE_TIMEZONES_OPTIONS = getAvailableTimezonesOptionList()
