import type { ColumnFiltersState } from "@tanstack/react-table"
import { useCallback, useEffect, useRef } from "react"

export function formatTableFilters(filters: ColumnFiltersState): Record<string, unknown> {
  return filters.reduce<Record<string, unknown>>((result, filter) => {
    result[filter.id] = String(filter.value)
    return result
  }, {})
}

type DebouncedCallback<Args extends unknown[]> = (...args: Args) => void

export function useDebouncedCallback<Args extends unknown[]>(
  callback: DebouncedCallback<Args>,
  delay: number,
) {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return useCallback(
    (...args: Args) => {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => callbackRef.current(...args), Math.max(0, delay))
    },
    [delay],
  )
}
