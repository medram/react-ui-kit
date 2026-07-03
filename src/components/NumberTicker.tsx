"use client"

import { useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"

import { cn } from "../lib/cn"

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
}: {
  value: number
  direction?: "up" | "down"
  className?: string
  delay?: number // delay in s
  decimalPlaces?: number
}) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : 0)
  const springValue = useSpring(motionValue, {
    damping: reducedMotion ? 1 : 60,
    stiffness: reducedMotion ? 1000 : 100,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    if (!isInView) return
    const finalValue = direction === "down" ? 0 : value
    if (reducedMotion) {
      motionValue.set(finalValue)
      return
    }
    const timeoutId = setTimeout(() => motionValue.set(finalValue), delay * 1000)
    return () => clearTimeout(timeoutId)
  }, [motionValue, isInView, delay, value, direction, reducedMotion])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)))
      }
    })
    return () => unsubscribe()
  }, [springValue, decimalPlaces])

  return (
    <span
      className={cn(
        "inline-block tabular-nums text-black dark:text-white tracking-wider",
        className,
      )}
      ref={ref}
    />
  )
}
