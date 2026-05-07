"use client"

import { useState } from "react"
import { Activity } from "lucide-react"
import { WindowFrame } from "./window-frame"
import { AudioVisualizer, WaveformVisualizer, CircularVisualizer } from "./audio-visualizer"

interface VisualizerWindowProps {
  isActive: boolean
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
}

type VisualizerMode = "bars" | "waveform" | "circular"

export function VisualizerWindow({ isActive, onClose, onMinimize, onFocus }: VisualizerWindowProps) {
  const [mode, setMode] = useState<VisualizerMode>("bars")
  const [isPlaying] = useState(true) // Simulated always playing for demo

  return (
    <WindowFrame
      title="Visualizer.exe"
      icon={<Activity className="h-4 w-4" />}
      isActive={isActive}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      defaultPosition={{ x: 450, y: 100 }}
      defaultSize={{ width: 400, height: 350 }}
    >
      <div className="flex h-full flex-col bg-background/80 p-4">
        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground font-mono mr-2">MODE://</span>
          {(["bars", "waveform", "circular"] as VisualizerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`chrome-button px-3 py-1 text-xs font-mono uppercase tracking-wider ${
                mode === m ? "text-primary border-primary/50" : "text-muted-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Visualizer Display */}
        <div className="flex-1 rounded border border-primary/30 bg-card/50 overflow-hidden relative">
          {/* CRT Effect Overlay */}
          <div className="absolute inset-0 crt-scanlines pointer-events-none z-10" />
          
          {/* Visualizer Content */}
          <div className="absolute inset-0 p-4">
            {mode === "bars" && <AudioVisualizer isPlaying={isPlaying} barCount={32} />}
            {mode === "waveform" && <WaveformVisualizer isPlaying={isPlaying} />}
            {mode === "circular" && <CircularVisualizer isPlaying={isPlaying} />}
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-primary/50" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-primary/50" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-primary/50" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-primary/50" />
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-2 rounded border border-primary/20 bg-card/30">
            <p className="text-xs text-muted-foreground font-mono">FREQ</p>
            <p className="text-lg text-primary font-mono tabular-nums">
              {Math.floor(Math.random() * 10000 + 20)}Hz
            </p>
          </div>
          <div className="p-2 rounded border border-primary/20 bg-card/30">
            <p className="text-xs text-muted-foreground font-mono">AMP</p>
            <p className="text-lg text-accent font-mono tabular-nums">
              -{Math.floor(Math.random() * 30 + 5)}dB
            </p>
          </div>
          <div className="p-2 rounded border border-primary/20 bg-card/30">
            <p className="text-xs text-muted-foreground font-mono">BPM</p>
            <p className="text-lg text-neon-pink font-mono tabular-nums">
              {Math.floor(Math.random() * 60 + 100)}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-2 pt-2 border-t border-primary/20 flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            RENDERING
          </span>
          <span>FPS: 60</span>
          <span>GPU: ACTIVE</span>
        </div>
      </div>
    </WindowFrame>
  )
}
