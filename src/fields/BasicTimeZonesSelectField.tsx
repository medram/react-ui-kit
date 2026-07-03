import { AVAILABLE_TIMEZONES_OPTIONS } from "../utils"
import SelectField from "./SelectField"

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
