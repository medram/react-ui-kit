# Wizard Controller

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/wizard-controller
```

Generated source: `components/ui/wizard-controller.ts`.

## Dependencies

- shadcn registry items: medram/react-ui-kit/wizard-types
- npm packages: None.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/wizard/wizard-controller.ts`](../../../registry/source/wizard/wizard-controller.ts).
- Exported declarations: `createWizardControllerProps`, `createWizardController`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
