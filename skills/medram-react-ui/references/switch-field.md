# Switch Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/switch-field
```

Generated source: `components/ui/switch-field.tsx`.

## Dependencies

- shadcn registry items: label, medram/react-ui-kit/form-error, medram/react-ui-kit/help, switch
- npm packages: formik
- runtime prerequisites: Formik form context with a matching initial value.

## Contract

- Source of truth: [`registry/source/fields/SwitchField.tsx`](../../../registry/source/fields/SwitchField.tsx).
- Exported declarations: `SwitchField`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
