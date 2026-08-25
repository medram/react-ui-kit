# Wizard Context Hook

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/wizard-context-hook
```

Generated source: `components/ui/wizard-context-hook.tsx`.

## Dependencies

- shadcn registry items: medram/react-ui-kit/wizard-context
- npm packages: None.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/wizard/wizard.hook.tsx`](../../../registry/source/wizard/wizard.hook.tsx).
- Exported declarations: `useWizardContext`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
