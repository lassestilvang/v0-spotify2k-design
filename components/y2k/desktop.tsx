"use client"

import { useState } from "react"
import { MatrixRain } from "./matrix-rain"
import { Taskbar } from "./taskbar"
import { DesktopIcon } from "./desktop-icon"
import { MusicPlayerWindow } from "./music-player-window"
import { VisualizerWindow } from "./visualizer-window"
import { TerminalWindow } from "./terminal-window"
import { AboutWindow } from "./about-window"

export function Desktop() {
  const [openWindows, setOpenWindows] = useState<string[]>(["player"])
  const [activeWindow, setActiveWindow] = useState<string>("player")
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([])

  const toggleWindow = (windowId: string) => {
    if (minimizedWindows.includes(windowId)) {
      setMinimizedWindows(minimizedWindows.filter(w => w !== windowId))
      setActiveWindow(windowId)
    } else if (openWindows.includes(windowId)) {
      setActiveWindow(windowId)
    } else {
      setOpenWindows([...openWindows, windowId])
      setActiveWindow(windowId)
    }
  }

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter(w => w !== windowId))
    setMinimizedWindows(minimizedWindows.filter(w => w !== windowId))
    if (activeWindow === windowId) {
      const remaining = openWindows.filter(w => w !== windowId)
      setActiveWindow(remaining[remaining.length - 1] || "")
    }
  }

  const minimizeWindow = (windowId: string) => {
    if (!minimizedWindows.includes(windowId)) {
      setMinimizedWindows([...minimizedWindows, windowId])
    }
  }

  const bringToFront = (windowId: string) => {
    setActiveWindow(windowId)
  }

  const isWindowOpen = (windowId: string) => 
    openWindows.includes(windowId) && !minimizedWindows.includes(windowId)

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background crt-scanlines">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Desktop Icons */}
      <div className="absolute left-4 top-4 flex flex-col gap-6 z-10">
        <DesktopIcon
          icon="music"
          label="SpotifY2K"
          onClick={() => toggleWindow("player")}
        />
        <DesktopIcon
          icon="visualizer"
          label="Visualizer"
          onClick={() => toggleWindow("visualizer")}
        />
        <DesktopIcon
          icon="terminal"
          label="Terminal"
          onClick={() => toggleWindow("terminal")}
        />
        <DesktopIcon
          icon="about"
          label="About.txt"
          onClick={() => toggleWindow("about")}
        />
      </div>

      {/* Windows */}
      {isWindowOpen("player") && (
        <MusicPlayerWindow
          isActive={activeWindow === "player"}
          onClose={() => closeWindow("player")}
          onMinimize={() => minimizeWindow("player")}
          onFocus={() => bringToFront("player")}
        />
      )}

      {isWindowOpen("visualizer") && (
        <VisualizerWindow
          isActive={activeWindow === "visualizer"}
          onClose={() => closeWindow("visualizer")}
          onMinimize={() => minimizeWindow("visualizer")}
          onFocus={() => bringToFront("visualizer")}
        />
      )}

      {isWindowOpen("terminal") && (
        <TerminalWindow
          isActive={activeWindow === "terminal"}
          onClose={() => closeWindow("terminal")}
          onMinimize={() => minimizeWindow("terminal")}
          onFocus={() => bringToFront("terminal")}
        />
      )}

      {isWindowOpen("about") && (
        <AboutWindow
          isActive={activeWindow === "about"}
          onClose={() => closeWindow("about")}
          onMinimize={() => minimizeWindow("about")}
          onFocus={() => bringToFront("about")}
        />
      )}

      {/* Taskbar */}
      <Taskbar
        openWindows={openWindows}
        activeWindow={activeWindow}
        minimizedWindows={minimizedWindows}
        onWindowClick={toggleWindow}
      />
    </div>
  )
}
