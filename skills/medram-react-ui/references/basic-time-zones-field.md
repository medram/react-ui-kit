# Basic Time Zones Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/basic-time-zones-field
```

Generated source: `components/ui/basic-time-zones-field.tsx`.

## Dependencies

- shadcn registry items: medram/react-ui-kit/medram-utils, medram/react-ui-kit/select-field
- npm packages: None.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/fields/BasicTimeZonesField.tsx`](../../../registry/source/fields/BasicTimeZonesField.tsx).
- Exported declarations: `BasicTimeZonesField`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
