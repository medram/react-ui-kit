import { AVAILABLE_TIMEZONES_OPTIONS } from "@/components/ui/medram-utils"
import SelectField from "@/components/ui/select-field"

type BasicTimeZonesFieldProps = Omit<React.ComponentProps<typeof SelectField>, "options">

export default function BasicTimeZonesField({ name, ...props }: BasicTimeZonesFieldProps) {
  return (
    <SelectField
      name={name}
      placeholder="site timezone"
      {...props}
      options={AVAILABLE_TIMEZONES_OPTIONS}
    />
  )
}
