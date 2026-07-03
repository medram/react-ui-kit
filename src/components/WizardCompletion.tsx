import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { Button } from "../primitives/button" // Assuming you have a reusable Button component

type WizardCompletionProps = {
  title?: string
  description?: string
  onGoBack?: () => void // Callback for the go-back action
}

export default function WizardCompletion({ title, description, onGoBack }: WizardCompletionProps) {
  const router = useRouter()
  const goingBack = useCallback(() => {
    // Go back
    if (onGoBack) {
      return onGoBack()
    }
    router.back()
  }, [onGoBack, router])

  return (
    <div className="completion-step-container w-full h-full flex flex-col items-center justify-center text-center py-8">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-primary">{title}</h2>
      <p className="text-primary mt-2">
        {description || "Congratulations! You have successfully completed all steps."}
      </p>

      {/* Go Back Button */}
      <Button variant="outline" className="mt-6" onClick={goingBack}>
        Go Back
      </Button>
    </div>
  )
}
