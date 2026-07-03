"use client"

import * as React from "react"

export type ModalProps = {
  isOpen: boolean
  close: () => void
  showOverlay?: boolean
}

export type OpenModalOptions = {
  modal: (props: ModalProps) => React.ReactNode
  title?: string
  description?: string
  contentClassName?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export type ModalContextType = {
  open: (options: OpenModalOptions) => void
  close: () => void
}

export const StackedModalContext = React.createContext<ModalContextType | null>(null)

export const useStackedModalsContext = () => {
  const context = React.use(StackedModalContext)
  if (!context) {
    throw new Error("useModalsContext must be used within a ModalsProvider")
  }
  return context
}
