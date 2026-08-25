// Yup schema for the DateRangePickerField. Lives outside the component file so Fast Refresh
// can preserve component state when only the schema or the component changes.
import * as yup from "yup"

export const DateRangeYupSchema = yup.object().shape({
  from: yup.date(),
  to: yup.date(),
})
