// Shared types for @flowui/ui, lifted from the host app so the package is
import type { ReactNode } from "react"
// self-contained. Kept structurally compatible with the app's equivalents.

export type Prettify<Obj extends Record<string, any>> = { [K in keyof Obj]: Obj[K] } & {}

export type AttachmentDto = {
  id: string
  name: string
  file: string
  size: number
  is_used: boolean
  tag: string
  link: string
  updated: string
  created: string
}

// Minimal shape consumed by CheckInHeatmap. `club_door` is intentionally
// opaque so the host app's richer CheckInDto stays assignable.
export type CheckInDto = {
  id: number
  member: number
  club_door: unknown
  notes: string | null
  is_successful: boolean
  check_in_time: string
  created: string
  updated: string
}

/**
 * Permission key — typed as string so the app's concrete union subtypes
 * are assignable without an explicit cast.
 */
export type UserPermission = string

/**
 * Shape of a wizard card item.  The `icon` uses a broad ComponentType so
 * any Lucide icon (or custom SVG component) satisfies it.
 */
export type WizardItem = {
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  permissions?: string[]
}

/** Backward-compatible alias matching the app's WIZARD_ITEM export name. */
export type { WizardItem as WIZARD_ITEM }

/**
 * Unified TabNavItem used by both Tabs (title: string) and VerticalTabs
 * (title: ReactNode|fn, optional icon).  Both component files import this
 * type; there is only one definition so TypeScript never renames it to $1.
 */
export type TabNavItem = {
  title: string | ReactNode | (() => ReactNode)
  hash: `#${string}`
  component: ReactNode
  description?: string
  permissions?: string[] | (() => boolean)
  icon?: ReactNode
}
