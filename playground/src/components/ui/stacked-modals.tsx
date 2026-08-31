"use client"

import LoadingSection from "@/components/ui/loading-section"
import { ModalStackedBox } from "@/components/ui/stacked-modal-box"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  ModalContextType,
  ModalProps,
  OpenModalOptions,
  StackedModalContext,
  useStackedModalsContext,
} from "@/components/ui/modal-context"

export type { ModalContextType, ModalProps, OpenModalOptions } from "@/components/ui/modal-context"

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

export function TriggerModal({
  children,
  ...buttonProps
}: Omit<React.ComponentProps<typeof Button>, "type">) {
  return (
    <Button type="button" {...buttonProps}>
      {children}
    </Button>
  )
}

export function useModalContext(): ModalContextType {
  return useStackedModalsContext()
}
