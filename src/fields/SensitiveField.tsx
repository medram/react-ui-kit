"use client"

import { ErrorMessage, useField } from "formik"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import FormError from "../components/FormError"
import Help from "../components/Help"
import { cn } from "../lib/cn"
import { Button } from "../primitives/button"
import { Input, InputProps } from "../primitives/input"
import { Label } from "../primitives/label"

type SensitiveFieldProps = InputProps & {
  name: string
  label?: string
  className?: string
  InputClassName?: string
  required?: boolean
  help?: string | React.ReactNode
}

function SensitiveField({
  name,
  label,
  InputClassName = "",
  className = "",
  required = false,
  help,
  ref,
  ...props
}: SensitiveFieldProps & { ref?: React.Ref<HTMLInputElement> }) {
  const [field] = useField<string>(name)
  const [showData, setShowDate] = useState(false)

  return (
    <div key={name} className={cn(`flex flex-col text-primary mb-2 gap-1 ${className}`)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          type={showData ? "text" : "password"}
          className={cn("hide-password-toggle pr-10 z-0", className)}
          ref={ref}
          {...field}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 z-10 py-2 hover:cursor-pointer hover:bg-transparent"
          onClick={() => setShowDate((prev) => !prev)}
          disabled={props.disabled}
        >
          {showData ? (
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">{showData ? "Hide password" : "Show password"}</span>
        </Button>

        {/* hides browsers password toggles */}
        <style>{`
              .hide-password-toggle::-ms-reveal,
              .hide-password-toggle::-ms-clear {
                visibility: hidden;
                pointer-events: none;
                display: none;
              }
            `}</style>
      </div>
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}

export default SensitiveField
