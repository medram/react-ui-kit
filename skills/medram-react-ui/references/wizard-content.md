# Wizard Content

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/wizard-content
```

Generated source: `components/ui/wizard-content.tsx`.

## Dependencies

- shadcn registry items: medram/react-ui-kit/wizard-context-hook
- npm packages: None.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/wizard/WizardContent.tsx`](../../../registry/source/wizard/WizardContent.tsx).
- Exported declarations: `WizardContent`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
