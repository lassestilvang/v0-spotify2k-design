"use client"

import { useState, useRef, useEffect } from "react"
import { X, Minus, Square } from "lucide-react"

interface WindowFrameProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  isActive: boolean
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
  minSize?: { width: number; height: number }
}

export function WindowFrame({
  title,
  icon,
  children,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  defaultPosition = { x: 100, y: 50 },
  defaultSize = { width: 600, height: 400 },
  minSize = { width: 300, height: 200 },
}: WindowFrameProps) {
  const [position, setPosition] = useState(defaultPosition)
  const [size, setSize] = useState(defaultSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, e.clientX - dragOffset.x),
          y: Math.max(0, e.clientY - dragOffset.y),
        })
      }
      if (isResizing) {
        setSize({
          width: Math.max(minSize.width, e.clientX - position.x),
          height: Math.max(minSize.height, e.clientY - position.y),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, position, minSize])

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    onFocus()
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    onFocus()
  }

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col window-glass rounded-sm overflow-hidden transition-shadow ${
        isActive ? "shadow-[0_0_30px_rgba(100,200,150,0.2)] z-40" : "opacity-90 z-30"
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className={`flex h-8 items-center justify-between px-2 cursor-move select-none border-b ${
          isActive
            ? "bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 border-primary/40"
            : "bg-muted/50 border-muted-foreground/20"
        }`}
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className={`${isActive ? "text-primary" : "text-muted-foreground"}`}>
            {icon}
          </div>
          <span className={`text-xs font-mono tracking-wider ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="flex h-5 w-5 items-center justify-center rounded-sm hover:bg-primary/20 transition-colors"
          >
            <Minus className="h-3 w-3 text-foreground/70 hover:text-primary" />
          </button>
          <button
            className="flex h-5 w-5 items-center justify-center rounded-sm hover:bg-primary/20 transition-colors"
          >
            <Square className="h-2.5 w-2.5 text-foreground/70 hover:text-primary" />
          </button>
          <button
            onClick={onClose}
            className="flex h-5 w-5 items-center justify-center rounded-sm hover:bg-destructive/20 transition-colors"
          >
            <X className="h-3 w-3 text-foreground/70 hover:text-destructive" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
        onMouseDown={handleResizeMouseDown}
      >
        <svg
          className="h-4 w-4 text-primary/40"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14Z" />
        </svg>
      </div>
    </div>
  )
}
