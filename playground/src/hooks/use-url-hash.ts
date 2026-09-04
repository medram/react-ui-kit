import { useCallback, useEffect, useState } from "react"

type UrlChange = { url: string; hash: string }

type UseUrlHashOptions = {
  onUrlChange?: (value: UrlChange) => void
  clearQueryParams?: boolean
}

export function useUrlHash(
  initialHash: string | undefined,
  { onUrlChange, clearQueryParams = false }: UseUrlHashOptions = {},
) {
  const readHash = useCallback(() => window.location.hash || initialHash || "", [initialHash])
  const [hash, setHashState] = useState(readHash)

  useEffect(() => {
    const handleHashChange = () => setHashState(readHash())
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [readHash])

  const setHash = useCallback(
    (nextHash: string) => {
      const url = new URL(window.location.href)
      if (clearQueryParams) url.search = ""
      url.hash = nextHash
      window.history.pushState(null, "", url)
      setHashState(nextHash)
      onUrlChange?.({ url: url.toString(), hash: nextHash })
    },
    [clearQueryParams, onUrlChange],
  )

  return [hash, setHash] as const
}
