# Custom Badge

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/custom-badge
```

Generated source: `components/ui/custom-badge.tsx`.

## Dependencies

- shadcn registry items: badge, medram/react-ui-kit/medram-utils
- npm packages: next-themes
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/components/CustomBadge.tsx`](../../../registry/source/components/CustomBadge.tsx).
- Exported declarations: `CustomBadge`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
