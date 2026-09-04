import { AVAILABLE_TIMEZONES_OPTIONS } from "@/components/ui/medram-utils"
import SelectField from "@/components/ui/select-field"

type TimeZonesSelectFieldProps = Omit<React.ComponentProps<typeof SelectField>, "options">

export default function BasicTimeZonesSelectField({ name, ...props }: TimeZonesSelectFieldProps) {
  return (
    <SelectField
      name={name}
      placeholder="site timezone"
      {...props}
      options={AVAILABLE_TIMEZONES_OPTIONS}
    />
  )
}
