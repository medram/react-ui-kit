export type WizardController = {
  next: () => void
  previous: () => void
  jumpTo: (stepNumber: number) => void
  reset: () => void
}

export type ProgressBarRenderProps = {
  currentStep: number
  totalSteps: number
  stepsDefinition: WizardStep[]
  controller: WizardController
  isLoading: boolean
}

export type WizardStep = {
  id: string
  title: string
  description?: string
  icon?: React.ComponentType<any>
  content:
    | React.ReactNode
    | ((props: {
        currentStep: number
        totalSteps: number
        controller: WizardController
      }) => React.ReactNode)
  titleClassName?: string
  descriptionClassName?: string
  contentClassName?: string
  stepIndicatorClassName?: string

  onNext?: () => void | Promise<void>
  onPrevious?: () => void | Promise<void>
}

export type WizardEvents = {
  onStepChange?: (step: number) => void
  onNext?: (currentStep: number, nextStep: number) => void
  onPrevious?: (currentStep: number, previousStep: number) => void
  onFinish?: (finalStep: number) => void
  onReset?: () => void
}
