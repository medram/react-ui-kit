import { cn } from "../lib/cn"
import { useWizardContext } from "./wizard.hook"

type WizardContentProps = {
  className?: string
}

export function WizardContent({ className }: WizardContentProps) {
  const { currentStep, totalSteps, currentStepData, controller } = useWizardContext()

  if (!currentStepData) {
    return <div className="text-destructive">Step not found</div>
  }

  const finalTitleClassName = cn("text-2xl font-semibold", currentStepData.titleClassName)

  const finalDescriptionClassName = cn(
    "text-muted-foreground",
    currentStepData.descriptionClassName,
  )

  const finalContentClassName = cn("wizard-step-content", currentStepData.contentClassName)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <h2 className={finalTitleClassName}>{currentStepData.title}</h2>
        {currentStepData.description && (
          <p className={finalDescriptionClassName}>{currentStepData.description}</p>
        )}
      </div>

      <div className={finalContentClassName}>
        {typeof currentStepData.content === "function"
          ? currentStepData.content({ currentStep, totalSteps, controller })
          : currentStepData.content}
      </div>
    </div>
  )
}
