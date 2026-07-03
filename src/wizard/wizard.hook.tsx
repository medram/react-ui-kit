import { use } from "react"
import { WizardContext } from "./WizardContext"

export function useWizardContext() {
  const context = use(WizardContext)
  if (!context) {
    throw new Error("useWizardContext must be used within a WizardProvider")
  }

  return context
}
