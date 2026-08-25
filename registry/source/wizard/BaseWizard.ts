// Bundle of wizard primitives consumed by both the index re-export and the
// top-level `Wizard` shell. Living in its own module breaks the cycle that
// existed when `Wizard.tsx` imported `BaseWizard` from `./index.ts`.
import { WizardContent } from "@/components/ui/wizard-content"
import { WizardProvider } from "@/components/ui/wizard-context"
import { WizardNavigation } from "@/components/ui/wizard-navigation"
import { WizardProgressBar } from "@/components/ui/wizard-progress-bar"

export const BaseWizard = {
  Provider: WizardProvider,
  ProgressBar: WizardProgressBar,
  Content: WizardContent,
  Navigation: WizardNavigation,
}
