import { Check } from "lucide-react"
import type React from "react"
import { cn } from "../lib/cn"
import { useWizardContext } from "./wizard.hook"

type WizardProgressBarProps = {
  showStepNumbers?: boolean
  showPercentage?: boolean
  allowClickNavigation?: boolean
  progressBarClassName?: string
  stepIndicatorClassName?: string
  activeStepClassName?: string
  completedStepClassName?: string
  pendingStepClassName?: string
  className?: string
}

export function WizardProgressBar({
  showStepNumbers = true,
  showPercentage = true,
  allowClickNavigation = true,
  progressBarClassName,
  stepIndicatorClassName,
  activeStepClassName,
  completedStepClassName,
  pendingStepClassName,
  className,
}: WizardProgressBarProps) {
  const {
    currentStep,
    totalSteps,
    stepsDefinition,
    controller,
    markLastStepAsCompleted,
    skipSteps,
  } = useWizardContext()

  const progressPercentage = markLastStepAsCompleted
    ? currentStep === totalSteps
      ? 100
      : ((currentStep - 1) / (totalSteps - 1)) * 100
    : ((currentStep - 1) / totalSteps) * 100

  return (
    <div className={cn("mb-6", className)}>
      {(showStepNumbers || showPercentage) && (
        <div className="flex justify-between items-center mb-4">
          {showStepNumbers && (
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={cn("w-full bg-secondary rounded-full h-2 mb-6 p-0", progressBarClassName)}>
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {stepsDefinition.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = markLastStepAsCompleted
            ? currentStep === totalSteps || stepNumber < currentStep
            : stepNumber < currentStep
          const IconComponent = step.icon

          const interactiveProps = allowClickNavigation
            ? {
                role: "button" as const,
                tabIndex: 0,
                onClick: (e: React.MouseEvent) => {
                  if (skipSteps) {
                    e.preventDefault()
                    e.stopPropagation()
                    controller.jumpTo(stepNumber)
                  }
                },
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (skipSteps && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    e.stopPropagation()
                    controller.jumpTo(stepNumber)
                  }
                },
              }
            : {}

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center",
                allowClickNavigation && "cursor-pointer hover:opacity-80 transition-opacity",
                stepIndicatorClassName,
                step.stepIndicatorClassName,
              )}
              {...interactiveProps}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 border-2 -mt-3",
                  isActive && cn("border-foreground", activeStepClassName),
                  isCompleted &&
                    cn(
                      "bg-green-500 text-primary-foreground border-green-500",
                      completedStepClassName,
                    ),
                  !isActive &&
                    !isCompleted &&
                    cn("bg-background text-muted-foreground border-border", pendingStepClassName),
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : IconComponent ? (
                  <IconComponent className="w-5 h-5 " />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs text-center max-w-20",
                  isActive ? "text-primary font-medium" : "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
