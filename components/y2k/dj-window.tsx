"use client"

import { useState, useEffect, useRef } from "react"
import { Radio, Mic, MicOff, Volume2, VolumeX, Play, Square, Zap, Waves, Antenna } from "lucide-react"
import { WindowFrame } from "./window-frame"
import { useDJ } from "@/lib/dj-context"

interface DJWindowProps {
  isOpen: boolean
  isActive: boolean
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
}

export function DJWindow({ isOpen, isActive, onClose, onMinimize, onFocus }: DJWindowProps) {
  const {
    isRadioMode,
    isSpeaking,
    djStatus,
    lastSpoken,
    toggleRadioMode,
    playStationId,
    playCommercial,
    playWeather,
    playNews,
    playRadioSegment,
    stopSpeaking,
  } = useDJ()

  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(16).fill(20))
  const animationRef = useRef<number>()

  // Animate visualizer when speaking
  useEffect(() => {
    if (isSpeaking) {
      const animate = () => {
        setVisualizerBars(prev => 
          prev.map(() => 20 + Math.random() * 80)
        )
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      // Slowly fade bars down
      const fadeInterval = setInterval(() => {
        setVisualizerBars(prev => {
          const newBars = prev.map(bar => Math.max(20, bar - 5))
          if (newBars.every(bar => bar === 20)) {
            clearInterval(fadeInterval)
          }
          return newBars
        })
      }, 50)
      return () => clearInterval(fadeInterval)
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isSpeaking])

  if (!isOpen) return null

  return (
    <WindowFrame
      title="NEXUS-DJ // AI Radio Host"
      icon={<Radio className="h-4 w-4" />}
      isActive={isActive}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      defaultPosition={{ x: 450, y: 80 }}
      defaultSize={{ width: 420, height: 520 }}
      minSize={{ width: 380, height: 450 }}
    >
      <div className="flex flex-col h-full bg-background/80 p-3 gap-3">
        {/* ON AIR Indicator */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded border ${
            isSpeaking 
              ? "bg-red-500/20 border-red-500 animate-pulse" 
              : "bg-muted/50 border-border"
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? "bg-red-500 animate-pulse" : "bg-muted-foreground/50"}`} />
            <span className={`text-xs font-mono font-bold tracking-widest ${isSpeaking ? "text-red-500" : "text-muted-foreground"}`}>
              ON AIR
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`text-xs font-mono px-2 py-1 rounded ${
              isRadioMode ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              {isRadioMode ? "RADIO MODE" : "MANUAL"}
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              STATUS: {djStatus.toUpperCase()}
            </div>
          </div>
        </div>

        {/* DJ Avatar / Visualizer Area */}
        <div className="relative flex-shrink-0 h-40 bg-black/50 rounded border border-primary/30 overflow-hidden">
          {/* CRT scanlines overlay */}
          <div className="absolute inset-0 crt-scanlines opacity-30 pointer-events-none z-10" />
          
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 102, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 102, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
              animation: "pulse 2s infinite",
            }} />
          </div>

          {/* Audio visualizer bars */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 h-full px-4 pb-2">
            {visualizerBars.map((height, i) => (
              <div
                key={i}
                className="w-4 rounded-t transition-all duration-75"
                style={{
                  height: `${height}%`,
                  background: `linear-gradient(to top, 
                    var(--primary) 0%, 
                    var(--cyber-green) 50%, 
                    var(--cyber-pink) 100%
                  )`,
                  boxShadow: isSpeaking ? "0 0 10px var(--primary)" : "none",
                }}
              />
            ))}
          </div>

          {/* DJ Icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`p-4 rounded-full border-2 ${
              isSpeaking 
                ? "border-primary bg-primary/10 animate-pulse" 
                : "border-muted-foreground/30 bg-black/30"
            }`}>
              <Antenna className={`w-12 h-12 ${isSpeaking ? "text-primary glow-green" : "text-muted-foreground/50"}`} />
            </div>
          </div>

          {/* Frequency display */}
          <div className="absolute top-2 left-2 font-mono text-xs text-primary/80">
            FREQ: 2000.0 MHz
          </div>
          <div className="absolute top-2 right-2 font-mono text-xs text-primary/80">
            <Waves className="w-3 h-3 inline mr-1" />
            NEXUS-FM
          </div>
        </div>

        {/* Last spoken text display */}
        <div className="flex-shrink-0 p-3 bg-black/40 rounded border border-border min-h-[80px] max-h-[100px] overflow-auto">
          <div className="text-xs font-mono text-muted-foreground mb-1">TRANSMISSION LOG:</div>
          <p className={`text-sm font-mono ${isSpeaking ? "text-primary glow-green" : "text-foreground/80"}`}>
            {lastSpoken || "// Awaiting transmission..."}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex-shrink-0">
          <div className="text-xs font-mono text-muted-foreground mb-2">BROADCAST CONTROLS:</div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={playStationId}
              disabled={isSpeaking}
              className="flex flex-col items-center gap-1 p-2 rounded border border-primary/30 bg-primary/5 hover:bg-primary/20 hover:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Radio className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-mono text-primary">STATION ID</span>
            </button>
            
            <button
              onClick={playCommercial}
              disabled={isSpeaking}
              className="flex flex-col items-center gap-1 p-2 rounded border border-cyber-pink/30 bg-cyber-pink/5 hover:bg-cyber-pink/20 hover:border-cyber-pink/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Zap className="w-4 h-4 text-cyber-pink" />
              <span className="text-[10px] font-mono text-cyber-pink">COMMERCIAL</span>
            </button>
            
            <button
              onClick={playWeather}
              disabled={isSpeaking}
              className="flex flex-col items-center gap-1 p-2 rounded border border-cyber-blue/30 bg-cyber-blue/5 hover:bg-cyber-blue/20 hover:border-cyber-blue/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Waves className="w-4 h-4 text-cyber-blue" />
              <span className="text-[10px] font-mono text-cyber-blue">WEATHER</span>
            </button>
            
            <button
              onClick={playNews}
              disabled={isSpeaking}
              className="flex flex-col items-center gap-1 p-2 rounded border border-cyber-purple/30 bg-cyber-purple/5 hover:bg-cyber-purple/20 hover:border-cyber-purple/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Antenna className="w-4 h-4 text-cyber-purple" />
              <span className="text-[10px] font-mono text-cyber-purple">NEWS</span>
            </button>
          </div>
        </div>

        {/* Radio Mode Toggle & Stop */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={toggleRadioMode}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded font-mono text-sm transition-all ${
              isRadioMode
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted hover:bg-muted/80 text-foreground"
            }`}
          >
            {isRadioMode ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isRadioMode ? "DISABLE RADIO MODE" : "ENABLE RADIO MODE"}
          </button>
          
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded font-mono text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all"
            >
              <Square className="w-4 h-4" />
              STOP
            </button>
          )}
        </div>

        {/* Full Segment Button */}
        <button
          onClick={playRadioSegment}
          disabled={isSpeaking}
          className="flex items-center justify-center gap-2 py-2 rounded border border-primary/50 bg-primary/10 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm text-primary transition-all"
        >
          <Play className="w-4 h-4" />
          PLAY RADIO SEGMENT
        </button>

        {/* Status bar */}
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground border-t border-border pt-2">
          <span>NEXUS-DJ v2.0.0.1</span>
          <span>CODEC: MP3/320kbps</span>
          <span>LATENCY: {Math.floor(Math.random() * 50 + 10)}ms</span>
        </div>
      </div>
    </WindowFrame>
  )
}
