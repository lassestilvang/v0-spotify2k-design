"use client"

import { Music, Activity, Terminal, FileText, Radio } from "lucide-react"

interface DesktopIconProps {
  icon: "music" | "visualizer" | "terminal" | "about" | "radio"
  label: string
  onClick: () => void
}

const iconComponents = {
  music: Music,
  visualizer: Activity,
  terminal: Terminal,
  about: FileText,
  radio: Radio,
}

export function DesktopIcon({ icon, label, onClick }: DesktopIconProps) {
  const IconComponent = iconComponents[icon]

  return (
    <button
      onClick={onClick}
      onDoubleClick={onClick}
      className="group flex flex-col items-center gap-1 p-2 rounded transition-all hover:bg-primary/10 focus:bg-primary/20 focus:outline-none"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Icon container */}
        <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-primary/40 bg-card/80 backdrop-blur group-hover:border-primary group-hover:bg-primary/15 group-hover:box-glow-green transition-all">
          <IconComponent className="h-6 w-6 text-primary group-hover:glow-green" />
        </div>
      </div>
      
      {/* Label */}
      <span className="text-xs text-primary/80 group-hover:text-primary group-hover:glow-green font-mono max-w-[80px] truncate text-center drop-shadow-[0_0_3px_rgba(100,255,150,0.5)]">
        {label}
      </span>
    </button>
  )
}
