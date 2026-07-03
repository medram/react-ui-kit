"use client"
import React, { Suspense, useMemo } from "react"
import { useUrlHash } from "../hooks/useUrlHash"
import { cn } from "../lib/cn"
import { Separator } from "../primitives/separator"
import type { TabNavItem } from "../types"
import LoadingSection from "./LoadingSection"

type hashType = `#${string}`

type styleModeType = "bobble" | "link"

const DEFAULT_STYLE_MODE: styleModeType = "bobble"

export type VerticalTabsProps = {
  items: TabNavItem[]
  className?: string
  suspense?: boolean
  showTitle?: boolean
  styleMode?: styleModeType
  tabsClassName?: string
  selectedItemClassName?: string
  innerContentClassName?: string
  contentClassName?: string
  onUrlChange?: ({ url, hash }: { url: string; hash: string }) => void
  /**
   * Permission check function — receives the tab's `permissions` array and
   * returns true if the tab should be shown.  When omitted all tabs are visible.
   * Pass `useUser().hasPerms` from the app.
   */
  hasPermission?: (perms: any[]) => boolean
  /**
   * Optional error boundary component wrapping the tab content.
   * Pass the app's `ErrorBoundary` if you want per-tab error recovery.
   */
  errorBoundary?: React.ComponentType<{ children: React.ReactNode }>
}

export default function VerticalTabs({
  items,
  className = "",
  suspense = true,
  showTitle = true,
  styleMode = DEFAULT_STYLE_MODE,
  tabsClassName = "",
  selectedItemClassName = "",
  innerContentClassName = "",
  contentClassName = "",
  onUrlChange,
  hasPermission,
  errorBoundary: ErrorBoundary,
}: VerticalTabsProps) {
  const [hash, setHash] = useUrlHash(items[0]?.hash, { onUrlChange })

  const selectedItem = items.find((item) => item.hash === hash)

  const selectedPerms =
    typeof selectedItem?.permissions === "function" ? null : selectedItem?.permissions ?? []
  const contentVisible = !selectedPerms?.length || !hasPermission || hasPermission(selectedPerms)

  return (
    <div className={cn(" space-y-6 pb-16 md:block ", className)}>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        {items && (
          <SidebarNav
            items={items}
            className={tabsClassName}
            currentHash={hash}
            onChange={(hash: hashType) => setHash(hash)}
            selectedItemClassName={selectedItemClassName}
            styleMode={styleMode}
            hasPermission={hasPermission}
          />
        )}
        {contentVisible && (
          <div className={cn("flex-1 min-w-0 w-full", contentClassName)}>
            {selectedItem && showTitle && (
              <div className="flex flex-col">
                <h2 className={cn("text-2xl font-bold tracking-tight mb-1")}>
                  {typeof selectedItem.title === "function"
                    ? selectedItem.title()
                    : selectedItem.title}
                </h2>
                {selectedItem?.description && (
                  <p className={cn("text-muted-foreground")}>{selectedItem.description}</p>
                )}
                {true && <Separator className="my-3" />}
              </div>
            )}

            {suspense ? (
              ErrorBoundary ? (
                <ErrorBoundary key={selectedItem?.hash}>
                  <Suspense fallback={<LoadingSection />}>
                    <div className={cn("min-w-0 w-full", innerContentClassName)}>
                      {selectedItem?.component}
                    </div>
                  </Suspense>
                </ErrorBoundary>
              ) : (
                <Suspense key={selectedItem?.hash} fallback={<LoadingSection />}>
                  <div className={cn("min-w-0 w-full", innerContentClassName)}>
                    {selectedItem?.component}
                  </div>
                </Suspense>
              )
            ) : (
              <div className={cn("min-w-0 w-full", innerContentClassName)}>
                {selectedItem?.component}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

type SidebarProps = {
  items: TabNavItem[]
  className?: string
  onChange?: (hash: hashType) => void
  currentHash: string
  itemClassName?: string
  selectedItemClassName?: string
  styleMode?: styleModeType
  hasPermission?: (perms: any[]) => boolean
}

function SidebarNav({
  items,
  className = "",
  onChange,
  currentHash,
  itemClassName = "",
  selectedItemClassName = "",
  styleMode = "bobble",
  hasPermission,
}: SidebarProps) {
  // Check permissions
  items = useMemo(
    () =>
      items.filter((item) => {
        if (!item.permissions) return true
        if (typeof item.permissions === "function") return item.permissions()
        if (!hasPermission) return true
        return hasPermission(item.permissions)
      }),
    [items, hasPermission],
  )

  return (
    <nav className={cn("lg:w-1/5 min-w-max flex-shrink-0", className)}>
      {items.map((item, i) => {
        return (
          <span
            key={item.hash}
            role="tab"
            tabIndex={0}
            onClick={() => {
              onChange?.(item.hash)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onChange?.(item.hash)
              }
            }}
            className={cn(
              "block py-2 px-4 text-muted-foreground mb-1 text-sm font-medium hover:text-foreground rounded-lg cursor-pointer flex items-center gap-2",
              styleMode === "link" && "hover:underline",
              styleMode === "bobble" && "hover:bg-muted",
              itemClassName,
              currentHash === item.hash &&
                (styleMode === "bobble"
                  ? "bg-muted hover:no-underline"
                  : "border-l-2 border-foreground text-foreground rounded-none bg-muted hover:no-underline"),
              currentHash === item.hash && selectedItemClassName,
            )}
          >
            {item.icon && <span className="mr-2 flex-shrink-0">{item.icon}</span>}
            {typeof item.title === "function" ? item.title() : item.title}
          </span>
        )
      })}
    </nav>
  )
}
