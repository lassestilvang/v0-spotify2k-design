"use client"

import { useEffect, useRef } from "react"

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Fill with dark background initially
      ctx.fillStyle = "#0a0f19"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const characters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\{}[]|=+-*&^%$#@!?"
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100)

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = "rgba(10, 15, 25, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `bold ${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = characters[Math.floor(Math.random() * characters.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Vary the green intensity - brighter for hacker aesthetic
        const intensity = Math.random()
        if (intensity > 0.90) {
          // Brightest - leading character with glow
          ctx.fillStyle = "#ffffff"
          ctx.shadowColor = "#00ff66"
          ctx.shadowBlur = 15
        } else if (intensity > 0.70) {
          // Bright green
          ctx.fillStyle = "#00ff66"
          ctx.shadowColor = "#00ff66"
          ctx.shadowBlur = 8
        } else if (intensity > 0.40) {
          // Medium green
          ctx.fillStyle = "#00cc55"
          ctx.shadowBlur = 0
        } else {
          // Dim green
          ctx.fillStyle = "#008844"
          ctx.shadowBlur = 0
        }

        ctx.fillText(char, x, y)

        // Reset shadow for next iteration
        ctx.shadowBlur = 0

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 45)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ background: "#0a0f19" }}
    />
  )
}
