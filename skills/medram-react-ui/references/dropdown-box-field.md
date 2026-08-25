# Dropdown Box Field

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/dropdown-box-field
```

Generated source: `components/ui/dropdown-box-field.tsx`.

## Dependencies

- shadcn registry items: dropdown-menu
- npm packages: formik
- runtime prerequisites: Formik form context with a matching initial value.

## Contract

- Source of truth: [`registry/source/fields/DropdownBoxField.tsx`](../../../registry/source/fields/DropdownBoxField.tsx).
- Exported declarations: `DropdownOption`, `DropdownBoxProps`, `DropdownBox`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
