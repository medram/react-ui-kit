import { ReactNode, Suspense } from "react"
import LoadingSection from "../components/LoadingSection"
import { BaseWizard } from "./BaseWizard"
import { ProgressBarRenderProps, WizardStep } from "./wizard.types"

type WizardProps = {
  children?: ReactNode
  steps: WizardStep[]
  initialStep?: number
  onStepChange?: (stepNumber: number) => void
  onNext?: (currentStep: number, nextStep: number) => void | Promise<void>
  onPrevious?: (currentStep: number, previousStep: number) => void | Promise<void>
  onFinish?: (finalStep: number) => void | Promise<void>
  onReset?: () => void | Promise<void>

  // Layout customization props (used only when render prop is not provided)
  className?: string
  progressBarClassName?: string
  activeStepClassName?: string
  navigationClassName?: string
  buttonClassName?: string
  showProgressBar?: boolean
  showNavigation?: boolean
  showStepNumbers?: boolean
  renderProgressBar?: (props: ProgressBarRenderProps) => ReactNode
  markLastStepAsCompleted?: boolean
  skipSteps?: boolean
  contentLoadingFallback?: ReactNode
}

export function Wizard({
  children,
  steps: stepsDefinition,
  initialStep = 1,
  onStepChange,
  onNext,
  onPrevious,
  onFinish,
  onReset,
  className,
  progressBarClassName,
  activeStepClassName,
  navigationClassName,
  buttonClassName,
  showProgressBar = true,
  showNavigation = true,
  showStepNumbers = true,
  renderProgressBar,
  markLastStepAsCompleted = false,
  skipSteps = false,
  contentLoadingFallback,
}: WizardProps) {
  const extraContext = {
    skipSteps,
    markLastStepAsCompleted,
  }

  return (
    <BaseWizard.Provider
      stepsDefinition={stepsDefinition}
      initialStep={initialStep}
      events={{
        onStepChange,
        onNext,
        onPrevious,
        onFinish,
        onReset,
      }}
      {...extraContext}
    >
      {({ isLoading, currentStep, controller }) => (
        <div className={className}>
          {showProgressBar &&
            (renderProgressBar ? (
              renderProgressBar({
                currentStep,
                totalSteps: stepsDefinition.length,
                stepsDefinition,
                controller,
                isLoading,
              })
            ) : (
              <BaseWizard.ProgressBar
                progressBarClassName={progressBarClassName}
                activeStepClassName={activeStepClassName}
                showStepNumbers={showStepNumbers}
              />
            ))}
          <Suspense fallback={<LoadingSection />}>
            <BaseWizard.Content />
          </Suspense>

          {children}

          {showNavigation && (
            <BaseWizard.Navigation
              className={navigationClassName}
              buttonClassName={buttonClassName}
            />
          )}
        </div>
      )}
    </BaseWizard.Provider>
  )
}
