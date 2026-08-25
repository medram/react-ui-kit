# Wizard Card

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/wizard-card
```

Generated source: `components/ui/wizard-card.tsx`.

## Dependencies

- shadcn registry items: card
- npm packages: @medram/react-ui-kit, lucide-react
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/components/WizardCard.tsx`](../../../registry/source/components/WizardCard.tsx).
- Exported declarations: `WizardCard`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
