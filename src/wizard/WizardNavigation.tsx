import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../lib/cn"
import { Button } from "../primitives/button"
import { useWizardContext } from "./wizard.hook"

type WizardNavigationProps = {
  showLabels?: boolean
  previousLabel?: string
  nextLabel?: string
  finishLabel?: string
  hideOnFirstStep?: boolean
  hideOnLastStep?: boolean
  className?: string
  buttonClassName?: string
  previousButtonClassName?: string
  nextButtonClassName?: string
  disableNextButton?: boolean
}

export function WizardNavigation({
  showLabels = true,
  previousLabel = "Previous",
  nextLabel = "Next",
  finishLabel = "Finish",
  hideOnFirstStep = false,
  hideOnLastStep = false,
  className,
  buttonClassName,
  previousButtonClassName,
  nextButtonClassName,
  disableNextButton = false,
}: WizardNavigationProps) {
  const { currentStep, totalSteps, controller, skipSteps } = useWizardContext()

  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  if ((hideOnFirstStep && isFirstStep) || (hideOnLastStep && isLastStep)) {
    return null
  }

  return (
    <div className={cn("flex justify-between items-center mt-6", className)}>
      <Button
        onClick={controller.previous}
        disabled={isFirstStep || !skipSteps}
        className={cn(buttonClassName, previousButtonClassName)}
      >
        <ChevronLeft className="w-4 h-4" />
        {showLabels && previousLabel}
      </Button>

      <span className="text-sm text-muted-foreground">
        {currentStep} / {totalSteps}
      </span>

      <Button
        disabled={disableNextButton || !skipSteps}
        onClick={controller.next}
        className={cn(buttonClassName, nextButtonClassName)}
      >
        {showLabels && (isLastStep ? finishLabel : nextLabel)}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
