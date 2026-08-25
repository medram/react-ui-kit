# Wizard Types

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/wizard-types
```

Generated source: `components/ui/wizard-types.ts`.

## Dependencies

- shadcn registry items: None.
- npm packages: None.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/wizard/wizard.types.ts`](../../../registry/source/wizard/wizard.types.ts).
- Exported declarations: `WizardController`, `ProgressBarRenderProps`, `WizardStep`, `WizardEvents`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
