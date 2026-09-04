import { format, isValid } from "date-fns"
import { ErrorMessage, useField } from "formik"
import { CalendarIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import FormError from "@/components/ui/form-error"
import Help from "@/components/ui/help"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DateFieldProps = {
  name: string
  label?: string
  help?: string | ReactNode
  required?: boolean
  className?: string
  placeholder?: string
  disableFn?: (date: Date) => boolean
  onChange?: (date: Date) => void
  disabled?: boolean
} & Omit<ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect" | "disabled" | "month" | "captionLayout" | "defaultMonth">

export default function DateField({
  name,
  label,
  help,
  required = false,
  className,
  placeholder = "Pick a date",
  disableFn,
  onChange,
  disabled,
  ...props
}: DateFieldProps) {
  const [field, _meta, helpers] = useField<Date | string>(name)

  // selectedDate is derived from the form value — no useEffect mirror.
  const parsedDate = field.value ? new Date(field.value) : null
  const selectedDate = parsedDate && isValid(parsedDate) ? parsedDate : null

  const setFieldValue = (date: Date | null) => {
    if (date) {
      // Adjust the date to compensate for the timezone difference.
      const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      const formattedDate = adjustedDate.toISOString().split("T")[0]
      helpers.setValue(formattedDate)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFieldValue(date)
      onChange?.(date)
    } else {
      helpers.setValue("")
    }
  }

  return (
    <div key={name} className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Popover>
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
            {field.value && selectedDate && isValid(selectedDate) ? (
              format(selectedDate, "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            {...field}
            {...props}
            mode="single"
            captionLayout="dropdown"
            defaultMonth={selectedDate ?? undefined}
            selected={selectedDate && isValid(selectedDate) ? selectedDate : undefined}
            onSelect={(date: Date | undefined) => handleDateChange(date)}
            disabled={disableFn}
            required={required}
          />
        </PopoverContent>
      </Popover>
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
