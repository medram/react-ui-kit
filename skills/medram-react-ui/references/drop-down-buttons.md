# Drop Down Buttons

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/drop-down-buttons
```

Generated source: `components/ui/drop-down-buttons.tsx`.

## Dependencies

- shadcn registry items: button, dropdown-menu, medram/react-ui-kit/loader, medram/react-ui-kit/stacked-modals
- npm packages: lucide-react
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/components/DropDownButtons.tsx`](../../../registry/source/components/DropDownButtons.tsx).
- Exported declarations: `DropDownButtonsItem`, `DropDownButtons`
- Owns local interaction state; use documented callback props to observe or control it.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
