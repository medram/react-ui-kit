"use client"

import LoadingSection from "../components/LoadingSection"
import { ModalStackedBox } from "./ModalStackedBox"

import * as React from "react"
import { Button } from "../primitives/button"
import {
  ModalContextType,
  ModalProps,
  OpenModalOptions,
  StackedModalContext,
  useStackedModalsContext,
} from "./modal-context"
import { modalGuard } from "./modal-guard"

export type { ModalContextType, ModalProps, OpenModalOptions } from "./modal-context"

function Modal({
  isOpen,
  close,
  title,
  description,
  contentClassName,
  children,
  showOverlay,
}: ModalProps & {
  title?: string
  description?: string
  contentClassName?: string
  children: React.ReactNode
  showOverlay?: boolean
}) {
  return (
    <ModalStackedBox
      isOpen={isOpen}
      onOpenChange={close}
      contentClassName={contentClassName}
      title={title}
      description={description}
      showOverlay={showOverlay}
    >
      <React.Suspense fallback={<LoadingSection />}>{children}</React.Suspense>
    </ModalStackedBox>
  )
}

type ModalStackEntry = {
  id: string
  component: React.ReactNode
  isOpen: boolean
}

export function StackedModalsProvider({ children }: { children: React.ReactNode }) {
  const [modalStack, setModalStack] = React.useState<ModalStackEntry[]>([])

  const open = React.useCallback(
    ({ modal, title, description, contentClassName, onSuccess, onCancel }: OpenModalOptions) => {
      if (process.env.NODE_ENV !== "production" && !modalGuard.allowed) {
        throw new Error(modalUsageError)
      }

      const handleClose = () => {
        onCancel?.()
        setModalStack((prev) => prev.slice(0, -1))
      }

      const newModal: ModalStackEntry = {
        id: Math.random().toString(36).slice(2),
        isOpen: true,
        component: (
          <Modal
            isOpen={true}
            close={() => {
              setModalStack((prev) => prev.slice(0, -1))
              onSuccess?.()
            }}
            title={title}
            description={description}
            contentClassName={contentClassName}
            showOverlay={modalStack.length === 0}
          >
            {modal({ isOpen: true, close: handleClose })}
          </Modal>
        ),
      }

      setModalStack((prev) => [...prev, newModal])
    },
    [modalStack.length],
  )

  const close = React.useCallback(() => {
    return setModalStack((prev) => {
      const newModals = [...prev]
      newModals.pop()
      return newModals
    })
  }, [])

  const contextValue = React.useMemo<ModalContextType>(
    () => ({
      open,
      close,
    }),
    [open, close],
  )

  return (
    <StackedModalContext.Provider value={contextValue}>
      {children}
      <MountedModals stack={modalStack} />
    </StackedModalContext.Provider>
  )
}

function MountedModals({ stack }: { stack: ModalStackEntry[] }) {
  return (
    <>
      {stack.map((modal, index) => (
        <div key={modal.id} className={index === stack.length - 1 ? "" : "hidden"}>
          {modal.component}
        </div>
      ))}
    </>
  )
}

// This component is used to trigger a modal an override the default button behavior
export function TriggerModal({
  children,
  onClick,
  ...buttonProps
}: Omit<React.ComponentProps<typeof Button>, "type">) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    modalGuard.allowed = true
    try {
      onClick?.(e)
    } finally {
      modalGuard.allowed = false
    }
  }

  return (
    <Button type="button" onClick={handleClick} {...buttonProps}>
      {children}
    </Button>
  )
}

export function useModalContext(): ModalContextType {
  return useStackedModalsContext()
}

const modalUsageError = `
🚨 MODAL USAGE ERROR: Modals must be opened from within a TriggerModal !

Wrap your modal trigger with TriggerModal to enable proper modal opening:

❌ Don't do this:
function MyComponent() {
  const { open } = useModalContext()
  return <Button onClick={() => open({ modal: ... })}>Open Modal</Button>
}

✅ Do this instead:
function MyComponent() {
  const { open } = useModalContext()
  return (
    <TriggerModal onClick={() => open({ modal: ... })}>
      Open Modal
    </TriggerModal>
  )
}

This prevents form submission issues by ensuring buttons have proper behavior.
`
