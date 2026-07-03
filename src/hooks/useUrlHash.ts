"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Tracks and controls the URL hash fragment (#section).  Pure browser code —
 * no routing framework dependency.  Copied verbatim from the app's
 * src/hooks/index.tsx so Tabs and VerticalTabs need not import it from there.
 */
export function useUrlHash(
  defaultHash: string = "",
  options: {
    onUrlChange?: ({ url, hash }: { url: string; hash: string }) => void
    clearQueryParams?: boolean
  } = {},
) {
  const [hash, setStateHash] = useState<string>(window.location.hash || defaultHash)

  const handlerRef = useRef<() => void>(() => {})
  handlerRef.current = () => {
    if (hash !== window.location.hash) setStateHash(window.location.hash)
  }

  useEffect(() => {
    const handler = () => handlerRef.current()
    window.addEventListener("hashchange", handler)
    return () => window.removeEventListener("hashchange", handler)
  }, [])

  const setHash = useCallback(
    (hash: string) => {
      const newUrl = new URL(window.location.href)
      newUrl.hash = hash
      if (options.clearQueryParams) newUrl.search = ""
      options.onUrlChange?.({ url: newUrl.toString(), hash })
      window.history.pushState({}, "", newUrl.toString())
      // Slight delay matches original — pushState doesn't trigger hashchange.
      setTimeout(() => setStateHash(hash), 500)
    },
    [options],
  )

  return [hash, setHash] as const
}
