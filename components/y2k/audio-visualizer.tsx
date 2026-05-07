"use client"

import { useEffect, useState } from "react"

interface AudioVisualizerProps {
  isPlaying: boolean
  barCount?: number
}

export function AudioVisualizer({ isPlaying, barCount = 16 }: AudioVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(barCount).fill(20))

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(barCount).fill(20))
      return
    }

    const interval = setInterval(() => {
      setBars(
        Array(barCount)
          .fill(0)
          .map(() => Math.random() * 80 + 20)
      )
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, barCount])

  return (
    <div className="flex items-end justify-center gap-0.5 h-full w-full p-2">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1.5 rounded-t-sm transition-all duration-100"
          style={{
            height: `${height}%`,
            background: `linear-gradient(to top, 
              rgb(100, 255, 150) 0%, 
              rgb(100, 200, 255) 50%, 
              rgb(255, 100, 200) 100%)`,
            opacity: isPlaying ? 1 : 0.3,
            boxShadow: isPlaying ? '0 0 10px rgba(100, 255, 150, 0.5)' : 'none',
          }}
        />
      ))}
    </div>
  )
}

export function WaveformVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const [points, setPoints] = useState<number[]>(Array(50).fill(50))

  useEffect(() => {
    if (!isPlaying) {
      setPoints(Array(50).fill(50))
      return
    }

    const interval = setInterval(() => {
      setPoints(
        Array(50)
          .fill(0)
          .map((_, i) => {
            const wave1 = Math.sin((Date.now() / 200 + i) * 0.5) * 20
            const wave2 = Math.sin((Date.now() / 150 + i) * 0.3) * 15
            const wave3 = Math.sin((Date.now() / 100 + i) * 0.8) * 10
            return 50 + wave1 + wave2 + wave3
          })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [isPlaying])

  const pathData = points
    .map((y, x) => `${x === 0 ? "M" : "L"} ${x * 4} ${y}`)
    .join(" ")

  return (
    <svg className="w-full h-full" viewBox="0 0 196 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(100, 255, 150)" />
          <stop offset="50%" stopColor="rgb(100, 200, 255)" />
          <stop offset="100%" stopColor="rgb(255, 100, 200)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={pathData}
        fill="none"
        stroke="url(#waveGradient)"
        strokeWidth="2"
        filter="url(#glow)"
        opacity={isPlaying ? 1 : 0.3}
      />
    </svg>
  )
}

export function CircularVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const [rotation, setRotation] = useState(0)
  const [bars, setBars] = useState<number[]>(Array(24).fill(30))

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360)
      setBars(
        Array(24)
          .fill(0)
          .map(() => Math.random() * 40 + 20)
      )
    }, 50)

    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(100, 255, 150)" />
          <stop offset="50%" stopColor="rgb(100, 200, 255)" />
          <stop offset="100%" stopColor="rgb(255, 100, 200)" />
        </linearGradient>
      </defs>
      <g transform={`rotate(${rotation} 50 50)`}>
        {bars.map((height, index) => {
          const angle = (index * 360) / bars.length
          const radian = (angle * Math.PI) / 180
          const innerRadius = 20
          const x1 = 50 + innerRadius * Math.cos(radian)
          const y1 = 50 + innerRadius * Math.sin(radian)
          const x2 = 50 + (innerRadius + height) * Math.cos(radian)
          const y2 = 50 + (innerRadius + height) * Math.sin(radian)

          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#circularGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity={isPlaying ? 1 : 0.3}
            />
          )
        })}
      </g>
      <circle
        cx="50"
        cy="50"
        r="15"
        fill="none"
        stroke="url(#circularGradient)"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  )
}
