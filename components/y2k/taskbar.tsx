"use client"

import { useState, useEffect } from "react"
import { Music, Activity, Terminal, FileText, Cpu, Wifi, Volume2 } from "lucide-react"

interface TaskbarProps {
  openWindows: string[]
  activeWindow: string
  minimizedWindows: string[]
  onWindowClick: (windowId: string) => void
}

const windowIcons: Record<string, React.ReactNode> = {
  player: <Music className="h-4 w-4" />,
  visualizer: <Activity className="h-4 w-4" />,
  terminal: <Terminal className="h-4 w-4" />,
  about: <FileText className="h-4 w-4" />,
}

const windowLabels: Record<string, string> = {
  player: "SpotifY2K",
  visualizer: "Visualizer",
  terminal: "Terminal",
  about: "About.txt",
}

export function Taskbar({ openWindows, activeWindow, minimizedWindows, onWindowClick }: TaskbarProps) {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: false 
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 h-10 window-glass border-t border-primary/30">
      <div className="flex h-full items-center justify-between px-2">
        {/* Start Button */}
        <button className="chrome-button flex h-7 items-center gap-2 px-3 text-xs text-primary">
          <div className="relative h-4 w-4">
            <div className="absolute inset-0 rounded-sm bg-primary/80 animate-pulse" />
            <Cpu className="relative h-4 w-4 text-background" />
          </div>
          <span className="hidden sm:inline font-bold tracking-wider">Y2K_OS</span>
        </button>

        {/* Open Windows */}
        <div className="flex flex-1 items-center gap-1 px-2 overflow-x-auto">
          {openWindows.map((windowId) => (
            <button
              key={windowId}
              onClick={() => onWindowClick(windowId)}
              className={`chrome-button flex h-7 items-center gap-2 px-3 text-xs transition-all ${
                activeWindow === windowId && !minimizedWindows.includes(windowId)
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : minimizedWindows.includes(windowId)
                  ? "opacity-50 text-muted-foreground"
                  : "text-foreground/70"
              }`}
            >
              {windowIcons[windowId]}
              <span className="hidden md:inline max-w-[100px] truncate">
                {windowLabels[windowId]}
              </span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-3 px-2 border-l border-primary/20">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wifi className="h-3.5 w-3.5 text-primary" />
            <Volume2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="flex items-center gap-1 text-xs font-mono text-primary">
            <span className="hidden sm:inline">SYS://</span>
            <span className="tabular-nums">{time}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
