# Full Screen Loading

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/full-screen-loading
```

Generated source: `components/ui/full-screen-loading.tsx`.

## Dependencies

- shadcn registry items: None.
- npm packages: next-themes, react-spinners
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/components/FullScreenLoading.tsx`](../../../registry/source/components/FullScreenLoading.tsx).
- Exported declarations: `FullScreenLoading`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
