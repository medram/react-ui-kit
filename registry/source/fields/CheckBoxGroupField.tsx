import { ErrorMessage, useField } from "formik"
import FormError from "@/components/ui/form-error"
import Help from "@/components/ui/help"
import { Label } from "@/components/ui/label"
import BaseCheckBoxField from "@/components/ui/base-check-box-field"

type OptionType = {
  label: string
  id: number | string
}

export type CheckBoxGroupFieldProps = {
  label?: string
  help?: string | React.ReactNode
  options: OptionType[]
  name: string
  required?: boolean
}

export default function CheckBoxGroupField({
  label,
  help,
  options,
  name,
  required = false,
}: CheckBoxGroupFieldProps) {
  const [field, meta, helpers] = useField<(number | string)[]>(name)

  const handleCheckedChange = (checked: boolean, itemId: number | string) => {
    if (checked) {
      helpers.setValue([...field.value, itemId])
    } else {
      helpers.setValue(field.value.filter((value) => value !== itemId))
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {options.map((item, i) => (
        <BaseCheckBoxField
          key={item.id}
          name={`checkbox-${i}`}
          checkboxLabel={item.label}
          checked={field.value?.includes(item.id)}
          onCheckedChange={(checked: boolean) => handleCheckedChange(checked, item.id)}
        />
      ))}
      {help && <Help>{help}</Help>}
      <ErrorMessage name={name} component={FormError} />
    </div>
  )
}
