import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { Formik, useFormikContext } from "formik"
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import DatePickerField from "../src/fields/DatePickerField"
import DateSelectorField from "../src/fields/DateSelectorField"
import MonthYearPickerField from "../src/fields/MonthYearPickerField"
import DateTimePickerField from "../src/fields/DateTimePickerField"
import { createCalendarDate } from "../src/lib/date-time"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
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

vi.mock("../src/primitives/calendar", () => ({
  Calendar: (props: Record<string, unknown>) => {
    mocks.calendarProps = props
    return <div data-testid="calendar" />
  },
}))

vi.mock("../src/primitives/button", () => ({
  Button: ({ children, variant: _variant, asChild: _asChild, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock("../src/primitives/label", () => ({
  Label: ({ children, ...props }: LabelProps) => <label {...props}>{children}</label>,
}))
vi.mock("../src/primitives/input", () => ({
  Input: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

vi.mock("../src/primitives/separator", () => ({
  Separator: () => null,
}))

vi.mock("../src/primitives/popover", () => ({
  Popover: ({ children, modal: _modal }: ChildrenProps) => <>{children}</>,
  PopoverContent: ({ children }: ChildrenProps) => <>{children}</>,
  PopoverTrigger: ({ children, asChild: _asChild }: ChildrenProps) => <>{children}</>,
}))

vi.mock("../src/primitives/select", () => ({
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
  SelectItem: ({ children, value }: SelectItemProps) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: ChildrenProps) => <span>{children}</span>,
  SelectValue: ({ placeholder }: SelectValueProps) => <span>{placeholder}</span>,
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

describe("timezone-aware Formik fields", () => {
  beforeEach(() => {
    mocks.calendarProps = undefined
    mocks.selectHandlers.length = 0
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "")
  })

  afterEach(() => {
    cleanup()
  })

  it("renders Casablanca wall components and stores the inverse instant", async () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "Africa/Casablanca")
    const onChange = vi.fn()

    render(
      <FieldForm initialValue="2026-09-22T18:19:29.220Z">
        <DatePickerField name="date" onChange={onChange} />
      </FieldForm>,
    )

    const selected = mocks.calendarProps?.selected as Date
    expect(parts(selected)).toEqual([2026, 8, 22, 19, 19, 29, 220])
    expect(capturedOnSelect).toBeDefined()

    const nextDate = createCalendarDate(2026, 8, 23)!
    await act(async () => {
      capturedOnSelect()(nextDate)
    })

    await waitFor(() => {
      expect(screen.getByTestId("value-date").textContent).toBe("2026-09-23T18:19:29.220Z")
    })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].toISOString()).toBe("2026-09-23T18:19:29.220Z")
  })

  it("uses the explicit timezone before a conflicting environment timezone", () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "UTC")

    render(
      <FieldForm initialValue="2026-09-22T18:19:29.220Z">
        <DatePickerField name="date" timezone="Africa/Casablanca" />
      </FieldForm>,
    )

    expect(parts(mocks.calendarProps?.selected as Date)).toEqual([2026, 8, 22, 19, 19, 29, 220])
  })

  it("supports environment-only and true local Date paths without leaking timezone", () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "Africa/Casablanca")
    const environmentView = render(
      <FieldForm initialValue="2026-09-22T18:19:29.220Z">
        <DatePickerField name="date" />
      </FieldForm>,
    )
    expect(parts(mocks.calendarProps?.selected as Date)).toEqual([2026, 8, 22, 19, 19, 29, 220])
    expect(Object.prototype.hasOwnProperty.call(mocks.calendarProps, "timezone")).toBe(false)
    expect(environmentView.container.innerHTML).not.toContain("timezone")

    environmentView.unmount()
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "")
    render(
      <FieldForm initialValue="2026-09-22T18:19:29.220Z">
        <DatePickerField name="date" />
      </FieldForm>,
    )
    expect(parts(mocks.calendarProps?.selected as Date)).toEqual(parts(new Date("2026-09-22T18:19:29.220Z")))
    expect(Object.prototype.hasOwnProperty.call(mocks.calendarProps, "timezone")).toBe(false)
    expect(screen.getByTestId("calendar").getAttribute("timezone")).toBeNull()
  })

  it("preserves calendar-only values and callback components in DatePicker", async () => {
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

  it("renders DateTimePicker in Casablanca wall time and stores the inverse instant", async () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "Africa/Casablanca")
    const onChange = vi.fn()

    render(
      <FieldForm initialValue="2026-09-22T18:19:29.220Z">
        <DateTimePickerField name="date" onChange={onChange} />
      </FieldForm>,
    )

    expect(parts(mocks.calendarProps?.selected as Date)).toEqual([2026, 8, 22, 19, 19, 29, 220])
    expect(screen.getAllByRole("spinbutton").map((input) => (input as HTMLInputElement).value)).toEqual([
      "19",
      "19",
    ])
    expect(Object.prototype.hasOwnProperty.call(mocks.calendarProps, "timezone")).toBe(false)

    await act(async () => {
      capturedOnSelect()(createCalendarDate(2026, 8, 23)!)
    })

    await waitFor(() => {
      expect(screen.getByTestId("value-date").textContent).toBe("2026-09-23T19:19+01:00")
    })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].toISOString()).toBe("2026-09-23T18:19:29.220Z")
  })

  it("converts DateTimePicker time edits in the resolved timezone", async () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "Africa/Casablanca")
    const onChange = vi.fn()

    render(
      <FieldForm initialValue="2026-09-22T18:19:29.220Z">
        <DateTimePickerField name="date" onChange={onChange} />
      </FieldForm>,
    )

    await act(async () => {
      fireEvent.change(screen.getAllByRole("spinbutton")[0], { target: { value: "20" } })
    })

    await waitFor(() => {
      expect(screen.getByTestId("value-date").textContent).toBe("2026-09-22T20:19+01:00")
    })
    expect(onChange.mock.calls[0][0].toISOString()).toBe("2026-09-22T19:19:29.220Z")
  })

  it("uses an explicit DateTimePicker timezone before the environment", () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "UTC")

    render(
      <FieldForm initialValue="2026-09-22T18:19:29.220Z">
        <DateTimePickerField name="date" timezone="Africa/Casablanca" />
      </FieldForm>,
    )

    expect(parts(mocks.calendarProps?.selected as Date)).toEqual([2026, 8, 22, 19, 19, 29, 220])
  })

  it("retains browser-local DateTimePicker behavior without a resolved timezone", () => {
    vi.stubEnv("NEXT_PUBLIC_APPLICATION_TIME_ZONE", "")

    render(
      <FieldForm initialValue="2026-09-22T18:19:29.220Z">
        <DateTimePickerField name="date" />
      </FieldForm>,
    )

    expect(parts(mocks.calendarProps?.selected as Date)).toEqual(parts(new Date("2026-09-22T18:19:29.220Z")))
    expect(Object.prototype.hasOwnProperty.call(mocks.calendarProps, "timezone")).toBe(false)
  })

  it("preserves calendar-only values and callback components in DateSelector", async () => {
    const onChange = vi.fn()

    render(
      <FieldForm initialValue="2026-08-01">
        <DateSelectorField name="date" timezone="America/Los_Angeles" onChange={onChange} />
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
    expect(Object.prototype.hasOwnProperty.call(mocks.calendarProps, "timezone")).toBe(false)
  })

  it("keeps MonthYear calendar values unchanged and retains defaultDay", async () => {
    const onChange = vi.fn()

    render(
      <FieldForm initialValue="2026-08-01">
        <MonthYearPickerField name="date" defaultDay={1} timezone="America/Los_Angeles" onChange={onChange} />
      </FieldForm>,
    )

    expect(screen.getByRole("button").textContent).toContain("August 2026, 01")
    await act(async () => {
      mocks.selectHandlers[1]("7")
    })

    await waitFor(() => {
      expect(screen.getByTestId("value-date").textContent).toBe("2026-08-01")
    })
    expect(parts(onChange.mock.calls[0][0])).toEqual([2026, 7, 1, 12, 0, 0, 0])
    expect(document.body.innerHTML).not.toContain("timezone")
  })

  it("clamps MonthYear defaultDay to the selected month", async () => {
    const onChange = vi.fn()

    render(
      <FieldForm initialValue="2026-01-31">
        <MonthYearPickerField name="date" defaultDay={31} onChange={onChange} />
      </FieldForm>,
    )

    await act(async () => {
      mocks.selectHandlers[1]("1")
    })

    await waitFor(() => {
      expect(screen.getByTestId("value-date").textContent).toBe("2026-02-28")
    })
    expect(parts(onChange.mock.calls[0][0])).toEqual([2026, 1, 28, 12, 0, 0, 0])
  })
})
