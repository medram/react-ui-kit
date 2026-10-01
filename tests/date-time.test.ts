import { describe, expect, it, vi } from "vitest"
import {
  createCalendarDate,
  currentDateInTimeZone,
  formatCalendarDate,
  instantToWallTime,
  parseCalendarDate,
  resolveTimeZone,
  wallTimeToInstant,
} from "../src/lib/date-time"

function dateParts(date: Date | null) {
  if (!date) throw new Error("Expected a valid date")

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    milliseconds: date.getMilliseconds(),
  }
}

describe("date-time utilities", () => {
  it("trims and validates IANA timezone candidates", () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "")

    expect(resolveTimeZone("  America/New_York  ")).toBe("America/New_York")
    expect(resolveTimeZone("not/a-timezone")).toBeUndefined()
    expect(resolveTimeZone("   ")).toBeUndefined()
  })

  it("prefers a valid explicit timezone over the environment", () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "UTC")

    expect(resolveTimeZone(" America/Los_Angeles ")).toBe("America/Los_Angeles")
    expect(resolveTimeZone("not/a-timezone")).toBe("UTC")
  })

  it("uses a valid environment timezone when no explicit value is supplied", () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", " Africa/Casablanca ")

    expect(resolveTimeZone()).toBe("Africa/Casablanca")
  })

  it("falls through invalid and blank candidates to local behavior", () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "")

    expect(resolveTimeZone("not/a-timezone")).toBeUndefined()
    expect(resolveTimeZone(" ")).toBeUndefined()

    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "not/a-timezone")
    expect(resolveTimeZone()).toBeUndefined()
  })

  it("keeps native local Date behavior when no timezone resolves", () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "")
    const instant = new Date("2026-09-22T18:19:29.220Z")

    expect(instantToWallTime(instant, undefined)?.getTime()).toBe(instant.getTime())
    expect(currentDateInTimeZone(undefined, instant).getTime()).toBe(instant.getTime())
  })

  it("maps the Casablanca instant to wall time and back", () => {
    const instant = new Date("2026-09-22T18:19:29.220Z")
    const wallTime = instantToWallTime(instant, "Africa/Casablanca")

    expect(dateParts(wallTime)).toEqual({
      year: 2026,
      month: 8,
      day: 22,
      hours: 19,
      minutes: 19,
      seconds: 29,
      milliseconds: 220,
    })
    expect(wallTimeToInstant(wallTime!, "Africa/Casablanca").toISOString()).toBe(
      "2026-09-22T18:19:29.220Z",
    )
  })

  it("maps valid New York wall times on both sides of the spring transition", () => {
    expect(dateParts(instantToWallTime(new Date("2026-03-08T06:30:00.000Z"), "America/New_York"))).toMatchObject({
      year: 2026,
      month: 2,
      day: 8,
      hours: 1,
      minutes: 30,
    })
    expect(dateParts(instantToWallTime(new Date("2026-03-08T07:30:00.000Z"), "America/New_York"))).toMatchObject({
      year: 2026,
      month: 2,
      day: 8,
      hours: 3,
      minutes: 30,
    })
  })

  it("rejects non-strict or invalid calendar strings", () => {
    expect(parseCalendarDate("2026-08-01")).not.toBeNull()
    expect(parseCalendarDate("2026-2-01")).toBeNull()
    expect(parseCalendarDate("2026-08-01 ")).toBeNull()
    expect(parseCalendarDate("2026-02-29")).toBeNull()
    expect(parseCalendarDate("2026-02-30")).toBeNull()
    expect(parseCalendarDate(new Date(Number.NaN))).toBeNull()
  })

  it("preserves local calendar components, including years below 100", () => {
    const calendarDate = createCalendarDate(5, 0, 2)

    expect(dateParts(calendarDate)).toMatchObject({ year: 5, month: 0, day: 2 })
    expect(formatCalendarDate(calendarDate!)).toBe("0005-01-02")
    expect(dateParts(parseCalendarDate("0005-01-02"))).toMatchObject({
      year: 5,
      month: 0,
      day: 2,
    })
  })

  it("uses the resolved zone across UTC day and year boundaries", () => {
    expect(dateParts(currentDateInTimeZone("UTC", new Date("2027-01-01T00:30:00.000Z")))).toMatchObject({
      year: 2027,
      month: 0,
      day: 1,
    })
    expect(
      dateParts(currentDateInTimeZone("America/Los_Angeles", new Date("2027-01-01T00:30:00.000Z"))),
    ).toMatchObject({
      year: 2026,
      month: 11,
      day: 31,
    })
    expect(dateParts(currentDateInTimeZone("Asia/Tokyo", new Date("2026-12-31T23:30:00.000Z")))).toMatchObject({
      year: 2027,
      month: 0,
      day: 1,
    })
  })
})
