import { format, isValid, setHours, setMinutes } from "date-fns"
import { ErrorMessage, useField } from "formik"
import { CalendarIcon, ClockIcon } from "lucide-react"
import type React from "react"
import { useState } from "react"
import FormError from "../components/FormError"
import Help from "../components/Help"
import { cn } from "../lib/cn"
import { Button } from "../primitives/button"
import { Calendar, CalendarProps } from "../primitives/calendar"
import { Input } from "../primitives/input"
import { Label } from "../primitives/label"
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/popover"
import { Separator } from "../primitives/separator"

const getFormattedValue = (date: Date) => {
  return format(date, "yyyy-MM-dd'T'HH:mmXXX")
}

type TimePickerSectionProps = {
  hours: number
  minutes: number
  onTimeChange: (hours: number, minutes: number) => void
  timeFormat?: "12h" | "24h"
  disabled?: boolean
}

function TimePickerSection({
  hours,
  minutes,
  onTimeChange,
  disabled = false,
}: TimePickerSectionProps) {
  // `draftHourInput` is null when the input mirrors the prop. While the user
  // is mid-type, it holds the raw string so we never reformat under their
  // cursor and never echo "01" while they are typing "10". Blur drops the
  // draft and the next render falls back to the prop-derived value.
  const [draftHourInput, setDraftHourInput] = useState<string | null>(null)
  const [draftMinuteInput, setDraftMinuteInput] = useState<string | null>(null)
  const [hourError, setHourError] = useState("")
  const [minuteError, setMinuteError] = useState("")

  const hourInput = draftHourInput ?? hours.toString().padStart(2, "0")
  const minuteInput = draftMinuteInput ?? minutes.toString().padStart(2, "0")

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDraftHourInput(val)
    const num = parseInt(val, 10)
    if (val === "" || isNaN(num) || num < 0 || num > 23) {
      setHourError("Hours must be 0–23")
    } else {
      setHourError("")
      onTimeChange(num, minutes)
    }
  }

  const handleHourBlur = () => {
    const num = parseInt(hourInput, 10)
    if (!isNaN(num) && num >= 0 && num <= 23) {
      setHourError("")
    } else {
      setHourError("Hours must be 0–23")
    }
    setDraftHourInput(null)
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDraftMinuteInput(val)
    const num = parseInt(val, 10)
    if (val === "" || isNaN(num) || num < 0 || num > 59) {
      setMinuteError("Minutes must be 0–59")
    } else {
      setMinuteError("")
      onTimeChange(hours, num)
    }
  }

  const handleMinuteBlur = () => {
    const num = parseInt(minuteInput, 10)
    if (!isNaN(num) && num >= 0 && num <= 59) {
      setMinuteError("")
    } else {
      setMinuteError("Minutes must be 0–59")
    }
    setDraftMinuteInput(null)
  }

  return (
    <div className="flex flex-col space-y-3 p-3">
      <div className="flex items-center space-x-2">
        <ClockIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Time</span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex flex-col space-y-1">
          <Label className="text-xs text-muted-foreground">Hour (0–23)</Label>
          <Input
            type="number"
            min={0}
            max={23}
            value={hourInput}
            onChange={handleHourChange}
            onBlur={handleHourBlur}
            className="w-20"
            disabled={disabled}
          />
          {hourError && <span className="text-xs text-red-500">{hourError}</span>}
        </div>

        <div className="flex flex-col space-y-1">
          <Label className="text-xs text-muted-foreground">Minute (0–59)</Label>
          <Input
            type="number"
            min={0}
            max={59}
            value={minuteInput}
            onChange={handleMinuteChange}
            onBlur={handleMinuteBlur}
            className="w-20"
            disabled={disabled}
          />
          {minuteError && <span className="text-xs text-red-500">{minuteError}</span>}
        </div>
      </div>
    </div>
  )
}

type DateTimePickerFieldProps = {
  name: string
  label?: string
  help?: string | React.ReactNode
  required?: boolean
  className?: string
  placeholder?: string
  disableFn?: (date: Date) => boolean
  onChange?: (date: Date) => void
  disabled?: boolean
  timeFormat?: "12h" | "24h"
  defaultTime?: { hours: number; minutes: number }
} & Omit<CalendarProps, "mode" | "selected" | "onSelect">

export default function DateTimePickerField({
  name,
  label,
  help,
  required = false,
  className,
  placeholder = "Pick date and time",
  disableFn,
  onChange,
  disabled,
  timeFormat = "24h",
  defaultTime = { hours: 0, minutes: 0 },
  ...props
}: DateTimePickerFieldProps) {
  const [field, meta, helpers] = useField<string>(name)
  const [isOpen, setIsOpen] = useState(false)

  // Parse the field value into a valid Date object if it exists
  const selectedDate = field.value ? new Date(field.value) : null
  const isValidDate = selectedDate && isValid(selectedDate)

  const getDisplayFormat = (date: Date) => {
    return timeFormat === "12h" ? format(date, "PPP 'at' h:mm a") : format(date, "PPP 'at' HH:mm")
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      helpers.setValue("")
      return
    }

    let newDate = date

    // If there's an existing time, preserve it; otherwise use default time
    if (isValidDate) {
      newDate = setHours(setMinutes(date, selectedDate.getMinutes()), selectedDate.getHours())
    } else {
      newDate = setHours(setMinutes(date, defaultTime.minutes), defaultTime.hours)
    }

    const formattedValue = getFormattedValue(newDate)
    helpers.setValue(formattedValue)
    onChange?.(newDate)
  }

  const handleTimeChange = (hours: number, minutes: number) => {
    let newDate = isValidDate ? new Date(selectedDate) : new Date()

    newDate = setHours(setMinutes(newDate, minutes), hours)

    const formattedValue = getFormattedValue(newDate)
    helpers.setValue(formattedValue)
    onChange?.(newDate)
  }

  return (
    <div key={name} className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.value && "text-muted-foreground",
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {isValidDate ? getDisplayFormat(selectedDate) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 flex flex-col md:flex-row justify-between"
          align="start"
        >
          <Calendar
            {...props}
            mode="single"
            selected={isValidDate ? selectedDate : undefined}
            defaultMonth={isValidDate ? selectedDate : undefined}
            onSelect={handleDateSelect}
            disabled={disableFn}
            initialFocus
          />

          <Separator className="md:hidden" />

          <TimePickerSection
            hours={isValidDate ? selectedDate.getHours() : defaultTime.hours}
            minutes={isValidDate ? selectedDate.getMinutes() : defaultTime.minutes}
            onTimeChange={handleTimeChange}
            timeFormat={timeFormat}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>

      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
