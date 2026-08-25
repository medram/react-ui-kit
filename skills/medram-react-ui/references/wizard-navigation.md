# Wizard Navigation

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/wizard-navigation
```

Generated source: `components/ui/wizard-navigation.tsx`.

## Dependencies

- shadcn registry items: button, medram/react-ui-kit/wizard-context-hook
- npm packages: lucide-react
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/wizard/WizardNavigation.tsx`](../../../registry/source/wizard/WizardNavigation.tsx).
- Exported declarations: `WizardNavigation`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
