# Wizard Context

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/wizard-context
```

Generated source: `components/ui/wizard-context.tsx`.

## Dependencies

- shadcn registry items: medram/react-ui-kit/wizard-controller, medram/react-ui-kit/wizard-types
- npm packages: None.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/wizard/WizardContext.tsx`](../../../registry/source/wizard/WizardContext.tsx).
- Exported declarations: `WizardContextType`, `WizardContext`, `WizardProviderProps`, `WizardProvider`
- Owns local interaction state; use documented callback props to observe or control it.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
