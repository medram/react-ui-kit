# Stacked Dialog

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/stacked-dialog
```

Generated source: `components/ui/stacked-dialog.tsx`.

## Dependencies

- shadcn registry items: button.
- npm packages: @radix-ui/react-dialog, lucide-react.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/modal/StackedDialog.tsx`](../../../registry/source/modal/StackedDialog.tsx).
- Exported declarations: `DialogStack`, `DialogStackBody`, `DialogStackClose`, `DialogStackContent`, `DialogStackDescription`, `DialogStackFooter`, `DialogStackHeader`, `DialogStackOverlay`, `DialogStackTitle`, `DialogStackTrigger`.
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Surface

- Uses the same shadcn Dialog surface treatment as `modal-box`: compact spacing, popover colors, rounded corners, blurred backdrop, and the standard close control.
- `DialogStackBody` keeps the content in a portal wrapper so stacked layers can be mounted independently.

## Usage

`StackedDialog` is the low-level primitive. Application triggers should use
`TriggerModal` below a `StackedModalsProvider`, then call
`const { open } = useModalContext()`. `ModalStackedBox` composes these
primitives for the standard stacked surface.

```tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  StackedModalsProvider,
  TriggerModal,
  useModalContext,
} from "@/components/ui/stacked-modals"

function OpenLayerButton() {
  const { open } = useModalContext()

  return (
    <TriggerModal
      onClick={() =>
        open({
          title: "First layer",
          description: "This layer is managed by the modal stack.",
          modal: ({ close }) => (
            <Button type="button" onClick={close}>
              Close layer
            </Button>
          ),
        })
      }
    >
      Open layer
    </TriggerModal>
  )
}

export function StackedDialogExample() {
  return (
    <StackedModalsProvider>
      <OpenLayerButton />
    </StackedModalsProvider>
  )
}
```

Use the primitive exports directly only when building a custom surface:

```tsx
import { Button } from "@/components/ui/button"
import {
  DialogStack,
  DialogStackBody,
  DialogStackContent,
  DialogStackDescription,
  DialogStackOverlay,
  DialogStackTitle,
  DialogStackTrigger,
} from "@/components/ui/stacked-dialog"

export function CustomStackedDialog() {
  return (
    <DialogStack>
      <DialogStackTrigger asChild>
        <Button type="button">Open custom dialog</Button>
      </DialogStackTrigger>
      <DialogStackOverlay />
      <DialogStackBody>
        <DialogStackContent>
          <DialogStackTitle>Custom dialog</DialogStackTitle>
          <DialogStackDescription>
            Compose the low-level stacked dialog parts when the default surface
            is not enough.
          </DialogStackDescription>
        </DialogStackContent>
      </DialogStackBody>
    </DialogStack>
  )
}
```

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
