import { useMemo } from "react"
import { allTimezones, useTimezoneSelect } from "react-timezone-select"
import SelectField from "./SelectField"

type TimeZonesSelectFieldProps = Omit<React.ComponentProps<typeof SelectField>, "options">

export default function TimeZonesSelectField({ name, ...props }: TimeZonesSelectFieldProps) {
  const { options } = useTimezoneSelect({ timezones: allTimezones })

  // 🇵🇸 Always Palestine
  const timezones = useMemo(() => {
    return options.map((option) =>
      option.value === "Asia/Jerusalem" ? { label: "(GMT+3:00) Gaza", value: "Asia/Gaza" } : option,
    )
  }, [options])

  return <SelectField name={name} placeholder="site timezone" {...props} options={timezones} />
}
