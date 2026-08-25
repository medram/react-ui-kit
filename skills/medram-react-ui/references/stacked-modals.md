# Stacked Modals

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/stacked-modals
```

Generated source: `components/ui/stacked-modals.tsx`.

## Dependencies

- shadcn registry items: button, medram/react-ui-kit/loading-section, medram/react-ui-kit/modal-context, medram/react-ui-kit/stacked-modal-box
- npm packages: None.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/modal/modal.hook.tsx`](../../../registry/source/modal/modal.hook.tsx).
- Exported declarations: `StackedModalsProvider`, `TriggerModal`, `useModalContext`
- Owns local interaction state; use documented callback props to observe or control it.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
