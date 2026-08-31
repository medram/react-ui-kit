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
