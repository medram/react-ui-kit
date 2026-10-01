import { act, cleanup, render, screen, waitFor } from "@testing-library/react"
import { Formik, useFormikContext } from "formik"
import type { ButtonHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import DateField from "../playground/src/components/ui/date-field"
import DatePickerField from "../playground/src/components/ui/date-picker-field"
import MonthYearPickerField from "../playground/src/components/ui/month-year-picker-field"
import { createCalendarDate } from "../playground/src/components/ui/medram-utils"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  size?: string
  variant?: string
}

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

type ChildrenProps = {
  asChild?: boolean
  children?: ReactNode
  modal?: boolean
}

type SelectProps = {
  children?: ReactNode
  disabled?: boolean
  onValueChange?: (value: string) => void
  value?: string
}

type SelectItemProps = {
  children?: ReactNode
  value: string
}

type SelectValueProps = {
  placeholder?: string
}

const mocks = vi.hoisted(() => ({
  calendarProps: undefined as Record<string, unknown> | undefined,
  selectHandlers: [] as Array<(value: string) => void>,
}))

vi.mock("@/components/ui/calendar", () => ({
  Calendar: (props: Record<string, unknown>) => {
    mocks.calendarProps = props
    return <div data-testid="calendar" />
  },
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, variant: _variant, size: _size, asChild: _asChild, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: LabelProps) => <label {...props}>{children}</label>,
}))

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children, modal: _modal }: ChildrenProps) => <>{children}</>,
  PopoverContent: ({ children }: ChildrenProps) => <>{children}</>,
  PopoverTrigger: ({ children, asChild: _asChild }: ChildrenProps) => <>{children}</>,
}))

vi.mock("@/components/ui/form-error", () => ({
  default: ({ children }: ChildrenProps) => <>{children}</>,
}))

vi.mock("@/components/ui/help", () => ({
  default: ({ children }: ChildrenProps) => <>{children}</>,
}))

vi.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange, value }: SelectProps) => {
    const handlerIndex = mocks.selectHandlers.length
    if (onValueChange) mocks.selectHandlers.push(onValueChange)
    return (
      <div data-testid={`select-${handlerIndex}`} data-value={value}>
        {children}
      </div>
    )
  },
  SelectContent: ({ children }: ChildrenProps) => <>{children}</>,
  SelectGroup: ({ children }: ChildrenProps) => <>{children}</>,
  SelectItem: ({ children, value }: SelectItemProps) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: ChildrenProps) => <span>{children}</span>,
  SelectValue: ({ placeholder }: SelectValueProps) => <span>{placeholder}</span>,
}))

vi.mock("@/lib/utils", () => ({
  cn: (...values: unknown[]) => values.filter(Boolean).join(" "),
}))

function FormValue({ name }: { name: string }) {
  const { values } = useFormikContext<Record<string, string | Date>>()
  return <output data-testid={`value-${name}`}>{String(values[name] ?? "")}</output>
}

function FieldForm({ name = "date", initialValue, children }: { name?: string; initialValue: string; children: ReactNode }) {
  return (
    <Formik initialValues={{ [name]: initialValue }} onSubmit={() => undefined}>
      {() => (
        <>
          {children}
          <FormValue name={name} />
        </>
      )}
    </Formik>
  )
}

function parts(date: Date) {
  return [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  ]
}

function capturedOnSelect() {
  const callback = mocks.calendarProps?.onSelect
  expect(typeof callback).toBe("function")
  return callback as (date: Date | undefined) => void
}

describe("latest timezone-aware Formik fields", () => {
  beforeEach(() => {
    mocks.calendarProps = undefined
    mocks.selectHandlers.length = 0
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "")
  })

  afterEach(() => {
    cleanup()
  })

  it("renders DatePicker in Casablanca wall time and stores the inverse instant", async () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "Africa/Casablanca")
    const onChange = vi.fn()

    render(
      <FieldForm initialValue="2026-09-22T18:19:29.220Z">
        <DatePickerField name="date" onChange={onChange} />
      </FieldForm>,
    )

    expect(parts(mocks.calendarProps?.selected as Date)).toEqual([2026, 8, 22, 19, 19, 29, 220])
    expect(Object.prototype.hasOwnProperty.call(mocks.calendarProps, "timezone")).toBe(false)

    await act(async () => {
      capturedOnSelect()(createCalendarDate(2026, 8, 23)!)
    })

    await waitFor(() => {
      expect(screen.getByTestId("value-date").textContent).toBe("2026-09-23T18:19:29.220Z")
    })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].toISOString()).toBe("2026-09-23T18:19:29.220Z")
  })

  it("uses the explicit timezone before a conflicting environment value", () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "UTC")

    render(
      <FieldForm initialValue="2026-09-22T18:19:29.220Z">
        <DatePickerField name="date" timezone="Africa/Casablanca" />
      </FieldForm>,
    )

    expect(parts(mocks.calendarProps?.selected as Date)).toEqual([2026, 8, 22, 19, 19, 29, 220])
  })

  it("preserves DatePicker calendar-only values across host timezones", async () => {
    const onChange = vi.fn()

    render(
      <FieldForm initialValue="2026-08-01">
        <DatePickerField name="date" dateOnly timezone="America/Los_Angeles" onChange={onChange} />
      </FieldForm>,
    )

    expect(parts(mocks.calendarProps?.selected as Date)).toEqual([2026, 7, 1, 12, 0, 0, 0])
    await act(async () => {
      capturedOnSelect()(createCalendarDate(2026, 7, 1)!)
    })

    await waitFor(() => {
      expect(screen.getByTestId("value-date").textContent).toBe("2026-08-01")
    })
    expect(parts(onChange.mock.calls[0][0])).toEqual([2026, 7, 1, 12, 0, 0, 0])
  })

  it("keeps DateField calendar components and consumer Calendar props", async () => {
    const onChange = vi.fn()
    const today = createCalendarDate(2026, 7, 15)!

    render(
      <FieldForm initialValue="2026-08-01">
        <DateField name="date" timezone="America/Los_Angeles" today={today} onChange={onChange} />
      </FieldForm>,
    )

    expect(parts(mocks.calendarProps?.selected as Date)).toEqual([2026, 7, 1, 12, 0, 0, 0])
    expect(mocks.calendarProps?.today).toBe(today)
    expect(Object.prototype.hasOwnProperty.call(mocks.calendarProps, "timezone")).toBe(false)

    await act(async () => {
      capturedOnSelect()(createCalendarDate(2026, 7, 1)!)
    })

    await waitFor(() => {
      expect(screen.getByTestId("value-date").textContent).toBe("2026-08-01")
    })
    expect(parts(onChange.mock.calls[0][0])).toEqual([2026, 7, 1, 12, 0, 0, 0])
  })

  it("keeps MonthYear calendar values and clamps defaultDay", async () => {
    const onChange = vi.fn()

    render(
      <FieldForm initialValue="2026-01-31">
        <MonthYearPickerField name="date" defaultDay={31} timezone="America/Los_Angeles" onChange={onChange} />
      </FieldForm>,
    )

    expect(screen.getByRole("button").textContent).toContain("January 2026")
    await act(async () => {
      mocks.selectHandlers[1]("1")
    })

    await waitFor(() => {
      expect(screen.getByTestId("value-date").textContent).toBe("2026-02-28")
    })
    expect(parts(onChange.mock.calls[0][0])).toEqual([2026, 1, 28, 12, 0, 0, 0])
    expect(document.body.innerHTML).not.toContain("timezone")
  })
})
