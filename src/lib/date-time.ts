import { fromZonedTime, toZonedTime } from "date-fns-tz"

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
  const yearText = year >= 0 ? String(year).padStart(4, "0") : `-${String(Math.abs(year)).padStart(4, "0")}`
  return `${yearText}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function parseInstant(value: Date | string): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime())
  }

  if (CALENDAR_DATE_PATTERN.test(value)) return null

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
