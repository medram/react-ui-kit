# Base Check Box Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/base-check-box-field
```

Generated source: `components/ui/base-check-box-field.tsx`.

## Dependencies

- shadcn registry items: checkbox
- npm packages: None.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/fields/BaseCheckBoxField.tsx`](../../../registry/source/fields/BaseCheckBoxField.tsx).
- Exported declarations: `BaseCheckBoxFieldProps`, `BaseCheckBoxField`
- Controlled checkbox state is supplied through `checked` and `onCheckedChange`.
- `checkboxLabel` is optional and remains associated with the generated checkbox id.
- Does not own persistent application state.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
