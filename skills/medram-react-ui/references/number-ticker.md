# Number Ticker

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/number-ticker
```

Generated source: `components/ui/number-ticker.tsx`.

## Dependencies

- shadcn registry items: None.
- npm packages: framer-motion
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/components/NumberTicker.tsx`](../../../registry/source/components/NumberTicker.tsx).
- Exported declarations: `NumberTicker`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
