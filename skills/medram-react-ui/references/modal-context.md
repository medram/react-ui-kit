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

## Usage

Wrap the trigger in `StackedModalsProvider`, then read the context with
`const { open } = useModalContext()`. Use the `modal` callback to receive the
layer's `close` function.

```tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  StackedModalsProvider,
  TriggerModal,
  useModalContext,
} from "@/components/ui/stacked-modals"

function ContextModalTrigger() {
  const { open } = useModalContext()

  return (
    <TriggerModal
      onClick={() =>
        open({
          title: "Context modal",
          description: "The provider owns the active modal layer.",
          modal: ({ close }) => (
            <Button type="button" onClick={close}>
              Close modal
            </Button>
          ),
        })
      }
    >
      Open modal
    </TriggerModal>
  )
}

export function ModalContextExample() {
  return (
    <StackedModalsProvider>
      <ContextModalTrigger />
    </StackedModalsProvider>
  )
}
```

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
