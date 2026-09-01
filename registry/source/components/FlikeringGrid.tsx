"use client"

import { useCallback, useEffect, useRef } from "react"

interface FlickeringGridProps {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  className?: string

  maxOpacity?: number
}

type GridParams = {
  cols: number
  dpr: number
  height: number
  rows: number
  squares: Float32Array
  width: number
}

const animationFrameInterval = 1000 / 30

export default function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInViewRef = useRef(false)

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number): GridParams => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.ceil(width * dpr)
      canvas.height = Math.ceil(height * dpr)

      const cols = Math.floor(width / (squareSize + gridGap))
      const rows = Math.floor(height / (squareSize + gridGap))
      const squares = new Float32Array(cols * rows)

      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity
      }

      return { cols, dpr, height, rows, squares, width }
    },
    [squareSize, gridGap, maxOpacity],
  )

  const updateSquares = useCallback(
    (squares: Float32Array, changedSquares: number[], deltaTime: number) => {
      changedSquares.length = 0
      const changeChance = flickerChance * Math.min(deltaTime, 0.25)

      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < changeChance) {
          squares[i] = Math.random() * maxOpacity
          changedSquares.push(i)
        }
      }
    },
    [flickerChance, maxOpacity],
  )

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, { cols, dpr, height, rows, squares, width }: GridParams) => {
      const step = squareSize + gridGap
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalAlpha = 1
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = color

      for (let column = 0; column < cols; column++) {
        for (let row = 0; row < rows; row++) {
          ctx.globalAlpha = squares[column * rows + row]
          ctx.fillRect(column * step, row * step, squareSize, squareSize)
        }
      }

      ctx.globalAlpha = 1
    },
    [color, squareSize, gridGap],
  )

  const drawChangedSquares = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      { dpr, rows, squares }: GridParams,
      changedSquares: number[],
    ) => {
      const step = squareSize + gridGap
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = color

      for (const index of changedSquares) {
        const column = Math.floor(index / rows)
        const row = index % rows
        const x = column * step
        const y = row * step

        ctx.globalAlpha = 1
        ctx.clearRect(x, y, squareSize, squareSize)
        ctx.globalAlpha = squares[index]
        ctx.fillRect(x, y, squareSize, squareSize)
      }

      ctx.globalAlpha = 1
    },
    [color, squareSize, gridGap],
  )

  const drawGridRef = useRef(drawGrid)
  drawGridRef.current = drawGrid

  const drawChangedSquaresRef = useRef(drawChangedSquares)
  drawChangedSquaresRef.current = drawChangedSquares

  const updateSquaresRef = useRef(updateSquares)
  updateSquaresRef.current = updateSquares

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number | null = null
    let gridParams: GridParams | null = null
    let lastUpdateTime = 0
    const changedSquares: number[] = []
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const updateCanvasSize = () => {
      const nextWidth = width ?? container.clientWidth
      const nextHeight = height ?? container.clientHeight

      if (nextWidth <= 0 || nextHeight <= 0) return
      if (gridParams?.width === nextWidth && gridParams.height === nextHeight) return

      gridParams = setupCanvas(canvas, nextWidth, nextHeight)
      drawGridRef.current(ctx, gridParams)
    }

    const stopAnimation = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
      lastUpdateTime = 0
    }

    const animate = (time: number) => {
      animationFrameId = null
      if (!isInViewRef.current || motionQuery.matches || !gridParams) return

      if (lastUpdateTime === 0) lastUpdateTime = time
      const elapsed = time - lastUpdateTime

      if (elapsed >= animationFrameInterval) {
        updateSquaresRef.current(gridParams.squares, changedSquares, elapsed / 1000)
        if (changedSquares.length > 0) {
          drawChangedSquaresRef.current(ctx, gridParams, changedSquares)
        }
        lastUpdateTime = time
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (animationFrameId !== null || !isInViewRef.current || motionQuery.matches) return
      lastUpdateTime = 0
      animationFrameId = requestAnimationFrame(animate)
    }

    updateCanvasSize()

    const resizeObserver = new ResizeObserver(updateCanvasSize)
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting
        if (entry.isIntersecting) startAnimation()
        else stopAnimation()
      },
      { threshold: 0 },
    )
    intersectionObserver.observe(canvas)

    const handleMotionPreferenceChange = () => {
      if (motionQuery.matches) stopAnimation()
      else startAnimation()
    }
    motionQuery.addEventListener("change", handleMotionPreferenceChange)

    return () => {
      stopAnimation()
      isInViewRef.current = false
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      motionQuery.removeEventListener("change", handleMotionPreferenceChange)
    }
  }, [setupCanvas, drawGrid, width, height])

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none block"
        style={{ width: width ?? "100%", height: height ?? "100%" }}
      />
    </div>
  )
}
