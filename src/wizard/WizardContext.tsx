"use client"

import { ReactNode, createContext, useCallback, useMemo, useState, useTransition } from "react"
import { createWizardController } from "./wizard-controller"
import { WizardController, WizardEvents, WizardStep } from "./wizard.types"

export type WizardContextType = {
  currentStep: number
  totalSteps: number
  stepsDefinition: WizardStep[]
  controller: WizardController
  currentStepData: WizardStep
  isLoading: boolean
  setCurrentStep: (step: number) => void
  setIsLoading: (loading: boolean) => void
  markLastStepAsCompleted?: boolean
  skipSteps: boolean
}

export const WizardContext = createContext<WizardContextType | null>(null)

export type WizardProviderProps = {
  children: ReactNode | ((context: WizardContextType) => ReactNode)
  stepsDefinition: WizardStep[]
  initialStep?: number
  events: WizardEvents
  markLastStepAsCompleted?: boolean
  skipSteps: boolean
}

export function WizardProvider({
  children,
  stepsDefinition,
  initialStep = 1,
  events,
  markLastStepAsCompleted = false,
  skipSteps = false,
}: WizardProviderProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isPending, startTransition] = useTransition()

  // No-op kept for backward compat: controller and context consumers may call this
  const setIsLoading = useCallback((_loading: boolean) => {}, [])

  const baseController = useMemo(
    () =>
      createWizardController({
        events,
        currentStep,
        isLoading: isPending,
        setIsLoading,
        setCurrentStep,
        stepsDefinition,
      }),
    [events, currentStep, isPending, setIsLoading, setCurrentStep, stepsDefinition],
  )

  // Wrap each method in startTransition so isPending tracks async step changes
  const controller = useMemo<WizardController>(
    () => ({
      next: () =>
        startTransition(() => {
          void baseController.next()
        }),
      previous: () =>
        startTransition(() => {
          void baseController.previous()
        }),
      jumpTo: (n: number) =>
        startTransition(() => {
          void baseController.jumpTo(n)
        }),
      reset: () =>
        startTransition(() => {
          baseController.reset()
        }),
    }),
    [baseController, startTransition],
  )

  const contextValue: WizardContextType = {
    currentStep,
    totalSteps: stepsDefinition.length,
    stepsDefinition,
    controller,
    currentStepData: stepsDefinition[currentStep - 1],
    isLoading: isPending,
    setCurrentStep,
    setIsLoading,
    markLastStepAsCompleted,
    skipSteps,
  }

  return (
    <WizardContext.Provider value={contextValue}>
      {typeof children === "function" ? children(contextValue) : children}
    </WizardContext.Provider>
  )
}
