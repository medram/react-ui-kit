# Stacked Modal Box

## Install

```bash
pnpm dlx shadcn@latest add medram/react-ui-kit/stacked-modal-box
```

Generated source: `components/ui/stacked-modal-box.tsx`.

## Dependencies

- shadcn registry items: dialog, medram/react-ui-kit/stacked-dialog
- npm packages: None.
- runtime prerequisites: None beyond the generated item dependencies.

## Contract

- Source of truth: [`registry/source/modal/ModalStackedBox.tsx`](../../../registry/source/modal/ModalStackedBox.tsx).
- Exported declarations: `ModalStackBoxProps`, `ModalStackedBox`
- Does not own persistent application state.
- Preserve the source-defined prop, callback, loading, disabled, empty, and error behavior when composing this item.

## Surface

- Matches `modal-box` for content spacing, typography, popover colors, backdrop treatment, and the standard close control.
- `showOverlay` defaults to `false`; standalone dialogs must opt in when they need a backdrop. `stacked-modals` enables the overlay for the base layer and omits it for nested layers.

## Usage

For an application trigger, use `TriggerModal` below one
`StackedModalsProvider` and open the stacked surface through
`useModalContext()`. The provider renders `ModalStackedBox` for each layer.

```tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  StackedModalsProvider,
  TriggerModal,
  useModalContext,
} from "@/components/ui/stacked-modals"

function OpenWorkspaceModal() {
  const { open } = useModalContext()

  return (
    <TriggerModal
      variant="outline"
      onClick={() =>
        open({
          title: "Workspace settings",
          description: "Review the current workspace configuration.",
          contentClassName: "sm:max-w-md",
          modal: ({ close }) => (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                This content is rendered inside `ModalStackedBox`.
              </p>
              <Button type="button" onClick={close}>
                Close modal
              </Button>
            </div>
          ),
        })
      }
    >
      Open workspace settings
    </TriggerModal>
  )
}

export function WorkspaceModalExample() {
  return (
    <StackedModalsProvider>
      <OpenWorkspaceModal />
    </StackedModalsProvider>
  )
}
```

## Framework boundary

Use the generated item in a client component when it owns events, hooks, Formik, browser APIs, or media access. The item has no Next-only import; keep Next routing/navigation in the host when needed.
