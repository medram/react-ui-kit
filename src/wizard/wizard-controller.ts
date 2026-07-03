import { WizardController, WizardEvents, WizardStep } from "./wizard.types"

export type createWizardControllerProps = {
  events: WizardEvents
  currentStep: number
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  setCurrentStep: (step: number) => void
  stepsDefinition: WizardStep[]
}

export function createWizardController({
  events,
  currentStep,
  isLoading,
  setIsLoading,
  setCurrentStep,
  stepsDefinition,
}: createWizardControllerProps) {
  const { onStepChange, onNext, onPrevious, onFinish, onReset } = events

  const handleStepChange = async (
    newStep: number,
    direction: "next" | "previous" | "jump" = "jump",
  ) => {
    if (isLoading) return

    try {
      setIsLoading(true)

      // Call global callbacks based on direction
      if (direction === "next" || direction === "jump") {
        if (newStep === stepsDefinition.length + 1 && onFinish) {
          await onFinish(newStep)
        } else if (onNext) {
          await onNext(currentStep, newStep)
        }
      } else if (direction === "previous" && onPrevious) {
        await onPrevious(currentStep, newStep)
      }

      setCurrentStep(newStep)
      onStepChange?.(newStep)
    } catch (error) {
      console.error("Step change error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const controller: WizardController = {
    next: async () => {
      if (isLoading) return

      const currentStepData = stepsDefinition[currentStep - 1]

      // Call step-level onNext
      if (currentStepData?.onNext) {
        await currentStepData.onNext()
      }

      const newStep = Math.min(currentStep + 1, stepsDefinition.length)
      if (newStep !== currentStep) {
        await handleStepChange(newStep, "next")
      }
    },
    previous: async () => {
      if (isLoading) return

      const currentStepData = stepsDefinition[currentStep - 1]

      // Call step-level onPrevious
      if (currentStepData?.onPrevious) {
        await currentStepData.onPrevious()
      }

      const newStep = Math.max(currentStep - 1, 1)
      if (newStep !== currentStep) {
        await handleStepChange(newStep, "previous")
      }
    },

    jumpTo: async (stepNumber: number) => {
      if (isLoading) return
      if (stepNumber >= 1 && stepNumber <= stepsDefinition.length && stepNumber !== currentStep) {
        await handleStepChange(stepNumber, "jump")
      }
    },

    reset: () => {
      if (isLoading) return
      setCurrentStep(1)
      onReset?.()
    },
  }

  return controller
}
