import { Label } from "@radix-ui/react-label"
import { ErrorMessage, useField } from "formik"
import { useCallback } from "react"
import FormError from "../components/FormError"
import Help from "../components/Help"
import UploadInput, { UploadInputProps } from "../inputs/UploadInput"
import { cn } from "../lib/cn"
import { AttachmentDto, Prettify } from "../types"

export type UploadFieldProps = Prettify<
  {
    name: string
    label?: string
    required?: boolean
    help?: string | React.ReactNode
    parseValue?: (attachment: AttachmentDto[]) => string[]
    disabled?: boolean
    singleValue?: boolean
  } & UploadInputProps
>

export default function UploadField({
  name,
  label = "",
  className = "",
  parseValue,
  minFiles = 0,
  maxFiles = 1,
  required = false,
  help,
  disabled = false,
  singleValue = false,
  onUploadComplete,
  ...props
}: UploadFieldProps) {
  const [field, _, helpers] = useField<string[] | string>({
    name,
    validate: (): string => {
      if (singleValue) {
        return required && !field.value ? "This field is required" : ""
      }

      if (minFiles > field.value.length) {
        return `Minimum ${minFiles} file(s) required`
      }
      if (maxFiles < field.value.length) {
        return `Maximum ${maxFiles} file(s) allowed`
      }
      return ""
    },
  })

  const handleOnUploadChange = useCallback(
    (attachments: AttachmentDto[]) => {
      if (onUploadComplete) return onUploadComplete(attachments)

      if (singleValue) {
        const id = attachments.length > 0 ? attachments[0].id : ""
        helpers.setValue(id)
        return
      }

      const ids = parseValue
        ? parseValue(attachments)
        : attachments.map((attachment) => attachment.id)
      helpers.setValue(ids)
    },
    [helpers, parseValue, onUploadComplete, singleValue],
  )

  return (
    <div className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      {label && (
        <Label htmlFor={name} className="mb-2 font-medium text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <UploadInput
        {...props}
        minFiles={minFiles}
        maxFiles={maxFiles}
        disabled={disabled}
        onUploadComplete={handleOnUploadChange}
        value={typeof field.value === "string" ? [field.value] : field.value}
      />
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
