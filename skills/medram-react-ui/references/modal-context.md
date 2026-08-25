# Modal Context

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/modal-context
```

Generated source: `components/ui/modal-context.tsx`.

## Dependencies

- shadcn registry items: None.
- npm packages: None.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/modal/modal-context.tsx`](../../../registry/source/modal/modal-context.tsx).
- Exported declarations: `ModalProps`, `OpenModalOptions`, `ModalContextType`, `StackedModalContext`, `useStackedModalsContext`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
