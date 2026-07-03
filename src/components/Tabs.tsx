"use client"
import React, { Suspense, useLayoutEffect, useMemo, useRef } from "react"
import { useUrlHash } from "../hooks/useUrlHash"
import { cn } from "../lib/cn"
import { Separator } from "../primitives/separator"
import type { TabNavItem } from "../types"
import LoadingSection from "./LoadingSection"

type hashType = `#${string}`
type styleModeType = "bobble" | "link" | "ios"

const DEFAULT_STYLE_MODE: styleModeType = "link"

export type TabsProps = {
  items: TabNavItem[]
  className?: string
  containerClassName?: string
  suspense?: boolean
  showTitle?: boolean
  showSeparator?: boolean
  styleMode?: styleModeType
  showTitleSeparator?: boolean
  tabsClassName?: string
  selectedItemClassName?: string
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

export default function Tabs({
  items,
  className = "",
  containerClassName = "",
  suspense = true,
  showTitle = false,
  showSeparator = true,
  showTitleSeparator = false,
  styleMode = DEFAULT_STYLE_MODE,
  tabsClassName = "",
  selectedItemClassName = "",
  onUrlChange,
  hasPermission,
  errorBoundary: ErrorBoundary,
}: TabsProps) {
  const [hash, setHash] = useUrlHash(items[0]?.hash, { onUrlChange, clearQueryParams: true })

  const selectedItem = items.find((item) => item.hash === hash)

  return (
    <div className={cn("space-y-6 pb-16", className)}>
      {items && (
        <HorizontalNav
          items={items}
          currentHash={hash}
          onChange={(hash: hashType) => setHash(hash)}
          styleMode={styleMode}
          className={tabsClassName}
          selectedItemClassName={selectedItemClassName}
          hasPermission={hasPermission}
        />
      )}
      {showSeparator && (
        <Separator className={cn("my-1", styleMode === "link" ? "!m-0" : "!mt-2")} />
      )}
      <div
        className={cn(
          "flex flex-col items-center justify-center space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0",
          containerClassName,
        )}
      >
        {selectedItem && showTitle && (
          <div className="flex flex-col">
            <h2 className={cn("text-2xl font-bold tracking-tight mb-3")}>
              {typeof selectedItem.title === "function" ? selectedItem.title() : selectedItem.title}
            </h2>
            {selectedItem?.description && (
              <p className={cn("text-muted-foreground")}>{selectedItem.description}</p>
            )}
            {showTitleSeparator && <Separator className="my-3" />}
          </div>
        )}

        {suspense ? (
          ErrorBoundary ? (
            <ErrorBoundary key={selectedItem?.hash}>
              <Suspense fallback={<LoadingSection />}>{selectedItem?.component}</Suspense>
            </ErrorBoundary>
          ) : (
            <Suspense key={selectedItem?.hash} fallback={<LoadingSection />}>
              {selectedItem?.component}
            </Suspense>
          )
        ) : (
          <>{selectedItem?.component}</>
        )}
      </div>
    </div>
  )
}

type HorizontalNavProps = {
  items: TabNavItem[]
  currentHash: string
  className?: string
  onChange?: (hash: hashType) => void
  itemClassName?: string
  styleMode?: styleModeType
  selectedItemClassName?: string
  hasPermission?: (perms: any[]) => boolean
}

function HorizontalNav({
  items,
  className = "",
  onChange,
  currentHash,
  itemClassName = "",
  styleMode = "link",
  selectedItemClassName = "",
  hasPermission,
}: HorizontalNavProps) {
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

  const tabRefs = useRef<(HTMLSpanElement | null)[]>([])
  const indicatorRef = useRef<HTMLSpanElement | null>(null)

  // activeIndex is derived from currentHash + items; no need for state.
  const activeIndex = currentHash ? items.findIndex((item) => item.hash === currentHash) : 0

  // useLayoutEffect (not useEffect) because we are measuring DOM after each
  // render to position the sliding indicator. Reading layout in an effect is
  // the correct primitive — moving this into the click handler would miss
  // hash-driven changes from elsewhere in the app and miss font-load reflows.
  useLayoutEffect(() => {
    const activeTab = tabRefs.current[activeIndex]
    const indicator = indicatorRef.current

    if (activeTab && indicator) {
      const { offsetWidth, offsetLeft } = activeTab
      indicator.style.transform = `translateX(${offsetLeft - 4}px)`
      indicator.style.width = `${offsetWidth}px`
    }
  }, [activeIndex, items])

  return (
    <nav
      className={cn(
        "relative flex flex-row gap-2 overflow-x-auto z-10 w-full lg:w-fit",
        styleMode === "ios" && "bg-muted  rounded-lg p-1",
        className,
      )}
    >
      {styleMode === "ios" && (
        <span
          ref={indicatorRef}
          className="absolute bg-background shadow-sm rounded-md transition-transform duration-300 ease-in-out"
          style={{
            height: "calc(100% - 8px)",
          }}
        />
      )}

      {items.map((item, i) => (
        <span
          key={item.hash}
          ref={(el) => {
            tabRefs.current[i] = el
          }}
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
            "block py-1 px-4 text-muted-foreground text-sm min-w-fit font-medium rounded-md cursor-pointer relative",
            styleMode === "link" && "hover:underline",
            styleMode === "bobble" && "hover:bg-muted",
            itemClassName,
            currentHash === item.hash &&
              (styleMode === "bobble"
                ? "bg-muted text-foreground hover:no-underline"
                : styleMode === "ios"
                  ? "text-foreground"
                  : "border-b-2 border-primary text-foreground rounded-none hover:no-underline"),
            currentHash === item.hash && selectedItemClassName,
          )}
        >
          {typeof item.title === "function" ? item.title() : item.title}
        </span>
      ))}
    </nav>
  )
}
