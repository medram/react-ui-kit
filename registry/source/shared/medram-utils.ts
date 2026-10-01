import { fromZonedTime, toZonedTime } from "date-fns-tz"

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

const CALENDAR_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

function validTimeZone(candidate: string | undefined): string | undefined {
  if (!candidate) return undefined

  const trimmed = candidate.trim()
  if (!trimmed) return undefined

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: trimmed }).format()
    return trimmed
  } catch {
    return undefined
  }
}

export function resolveTimeZone(timezone?: string): string | undefined {
  const explicitTimeZone = validTimeZone(timezone)
  if (explicitTimeZone) return explicitTimeZone

  let applicationTimeZone: string | undefined
  try {
    applicationTimeZone = process.env.NEXT_PUBLIC_APPLICATION_TIME_ZONE
  } catch {
    applicationTimeZone = undefined
  }

  return validTimeZone(applicationTimeZone)
}

export function createCalendarDate(year: number, monthIndex: number, day: number): Date | null {
  if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || !Number.isInteger(day)) {
    return null
  }

  const date = new Date(0)
  date.setHours(12, 0, 0, 0)
  date.setFullYear(year, monthIndex, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export function lastDayOfCalendarMonth(year: number, monthIndex: number): number | null {
  const firstDay = createCalendarDate(year, monthIndex, 1)
  if (!firstDay) return null

  firstDay.setMonth(monthIndex + 1, 0)
  return firstDay.getDate()
}

export function parseCalendarDate(value: Date | string | null | undefined): Date | null {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null
    return createCalendarDate(value.getFullYear(), value.getMonth(), value.getDate())
  }

  if (typeof value !== "string") return null

  const match = CALENDAR_DATE_PATTERN.exec(value)
  if (!match) return null

  return createCalendarDate(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

export function formatCalendarDate(date: Date): string {
  if (Number.isNaN(date.getTime())) return ""

  const year = date.getFullYear()
  const yearText =
    year >= 0 ? String(year).padStart(4, "0") : `-${String(Math.abs(year)).padStart(4, "0")}`
  return `${yearText}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function parseInstant(value: Date | string): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime())
  }

  if (CALENDAR_DATE_PATTERN.test(value) || CALENDAR_DATE_PATTERN.test(value.trim())) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function instantToWallTime(value: Date | string, timezone: string | undefined): Date | null {
  const instant = parseInstant(value)
  if (!instant) return null
  return timezone ? toZonedTime(instant, timezone) : instant
}

export function wallTimeToInstant(value: Date, timezone: string | undefined): Date {
  const wallTime = new Date(value.getTime())
  return timezone ? fromZonedTime(wallTime, timezone) : wallTime
}

export function currentDateInTimeZone(timezone: string | undefined, now: Date = new Date()): Date {
  return timezone ? toZonedTime(now, timezone) : new Date(now.getTime())
}
