import { Checkbox } from "@/components/ui/checkbox"

export type BaseCheckBoxFieldProps = {
  name: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  inputClassName?: string
  checkboxLabel?: string
}

export default function BaseCheckBoxField({
  checkboxLabel,
  name,
  ...props
}: BaseCheckBoxFieldProps) {
  return (
    <div className="items-top items-center flex space-x-2">
      <Checkbox {...props} id={name} />
      {checkboxLabel && (
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor={name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {checkboxLabel}
          </label>
        </div>
      )}
    </div>
  )
}
