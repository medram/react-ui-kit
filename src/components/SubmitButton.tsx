import { useFormikContext } from "formik"
import { Button } from "../primitives/button"
import Loader from "./Loader"

type ButtonProps = {
  title?: string
  children?: React.ReactNode
  className?: string
} & Parameters<typeof Button>[0]

export default function SubmitButton({ title, children, className, ...rest }: ButtonProps) {
  // access the formik context
  const formik = useFormikContext()
  return (
    <Button type="submit" className={className} {...rest}>
      {formik.isSubmitting ? (
        <Loader themeColors={{ light: "#fff", dark: "#333" }} speedMultiplier={0.8} size={10} />
      ) : (
        title || children
      )}
    </Button>
  )
}
