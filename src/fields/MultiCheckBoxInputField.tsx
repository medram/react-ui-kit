import { ErrorMessage, useField } from "formik"
import FormError from "../components/FormError"
import Help from "../components/Help"
import { Label } from "../primitives/label"
import CheckBoxInputFieldThin from "./CheckBoxInputThinField"

type OptionType = {
  label: string
  id: number | string
}

type MultiCheckBoxInputFieldProps = {
  label?: string
  help?: string | React.ReactNode
  options: OptionType[]
  name: string
  required?: boolean
}

export default function MultiCheckBoxInputField({
  label,
  help,
  options,
  name,
  required = false,
}: MultiCheckBoxInputFieldProps) {
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
        <CheckBoxInputFieldThin
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
