# Loading Section

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/loading-section
```

Generated source: `components/ui/loading-section.tsx`.

## Dependencies

- shadcn registry items: medram/react-ui-kit/loader
- npm packages: None.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/components/LoadingSection.tsx`](../../../registry/source/components/LoadingSection.tsx).
- Exported declarations: `LoadingSection`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
