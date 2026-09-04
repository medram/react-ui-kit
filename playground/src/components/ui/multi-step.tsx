import { useMemo } from "react"

type MultiStepProps = {
  steps: readonly string[]
  currentStep: string
}

export default function MultiStep({ steps, currentStep }: MultiStepProps) {
  const currentStepIndex = useMemo(() => steps.indexOf(currentStep), [currentStep, steps])

  // Calculate progress percentage
  const progress = (currentStepIndex / (steps.length - 1)) * 100

  return (
    <div className="relative w-full pt-2 py-8">
      {/* Base line */}
      <div className="relative w-full h-1 rounded-full bg-emerald-50">
        {/* Progress bar */}
        <div
          className="absolute h-full bg-emerald-600 transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${progress}%` }}
        />

        {/* Steps container */}
        <div className="absolute inset-x-0 flex justify-between" style={{ top: "-0.375rem" }}>
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex

            return (
              <div key={step} className="flex flex-col items-center">
                {/* Checkpoint marker with white background for floating effect */}
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-colors duration-300 shadow-sm ${
                    isCompleted
                      ? "bg-emerald-600 border-emerald-600"
                      : isCurrent
                        ? "bg-white border-emerald-600"
                        : "bg-white border-gray-300"
                  }`}
                />
                {/* Step label */}
                <span
                  className={`mt-2 text-xs md:text-sm font-normal capitalize ${
                    isCompleted || isCurrent ? "text-emerald-600 font-medium" : "text-foreground"
                  }`}
                >
                  {step}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
