// Bundle of wizard primitives consumed by both the index re-export and the
// top-level `Wizard` shell. Living in its own module breaks the cycle that
// existed when `Wizard.tsx` imported `BaseWizard` from `./index.ts`.
import { WizardContent } from "./WizardContent"
import { WizardProvider } from "./WizardContext"
import { WizardNavigation } from "./WizardNavigation"
import { WizardProgressBar } from "./WizardProgressBar"

export const BaseWizard = {
  Provider: WizardProvider,
  ProgressBar: WizardProgressBar,
  Content: WizardContent,
  Navigation: WizardNavigation,
}
