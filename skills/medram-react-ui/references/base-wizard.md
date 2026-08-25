# Base Wizard

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/base-wizard
```

Generated source: `components/ui/base-wizard.ts`.

## Dependencies

- shadcn registry items: medram/react-ui-kit/wizard-content, medram/react-ui-kit/wizard-context, medram/react-ui-kit/wizard-navigation, medram/react-ui-kit/wizard-progress-bar
- npm packages: None.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/wizard/BaseWizard.ts`](../../../registry/source/wizard/BaseWizard.ts).
- Exported declarations: `BaseWizard`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
