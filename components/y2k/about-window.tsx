"use client"

import { FileText, ExternalLink } from "lucide-react"
import { WindowFrame } from "./window-frame"

interface AboutWindowProps {
  isActive: boolean
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
}

export function AboutWindow({ isActive, onClose, onMinimize, onFocus }: AboutWindowProps) {
  return (
    <WindowFrame
      title="About.txt"
      icon={<FileText className="h-4 w-4" />}
      isActive={isActive}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      defaultPosition={{ x: 300, y: 150 }}
      defaultSize={{ width: 450, height: 400 }}
    >
      <div className="h-full bg-background/80 p-6 font-mono text-sm overflow-auto">
        {/* ASCII Art Header */}
        <pre className="text-primary text-xs leading-tight mb-6 overflow-x-auto">
{`
 ██████╗ ██████╗  ██████╗ ████████╗██╗███████╗██╗   ██╗██████╗ ██╗  ██╗
██╔════╝ ██╔══██╗██╔═══██╗╚══██╔══╝██║██╔════╝╚██╗ ██╔╝╚════██╗██║ ██╔╝
███████╗ ██████╔╝██║   ██║   ██║   ██║█████╗   ╚████╔╝  █████╔╝█████╔╝ 
╚════██║ ██╔═══╝ ██║   ██║   ██║   ██║██╔══╝    ╚██╔╝  ██╔═══╝ ██╔═██╗ 
██████╔╝ ██║     ╚██████╔╝   ██║   ██║██║        ██║   ███████╗██║  ██╗
╚═════╝  ╚═╝      ╚═════╝    ╚═╝   ╚═╝╚═╝        ╚═╝   ╚══════╝╚═╝  ╚═╝
`}
        </pre>

        <div className="space-y-4">
          <div className="border border-primary/30 rounded p-4 bg-card/30">
            <h2 className="text-primary text-lg mb-2">// ABOUT</h2>
            <p className="text-foreground/80 leading-relaxed">
              SpotifY2K is a nostalgic music player experience that transports you back to 
              the early 2000s. Inspired by the hacker aesthetic, CRT monitors, Winamp skins, 
              and the Y2K era of computing.
            </p>
          </div>

          <div className="border border-primary/30 rounded p-4 bg-card/30">
            <h2 className="text-primary text-lg mb-2">// FEATURES</h2>
            <ul className="text-foreground/80 space-y-1">
              <li>+ Matrix-style visual effects</li>
              <li>+ Audio-reactive visualizers</li>
              <li>+ Chrome-style Y2K buttons</li>
              <li>+ Translucent window effects</li>
              <li>+ CRT scanline overlays</li>
              <li>+ Fake desktop OS environment</li>
              <li>+ Retro terminal interface</li>
            </ul>
          </div>

          <div className="border border-primary/30 rounded p-4 bg-card/30">
            <h2 className="text-primary text-lg mb-2">// SYSTEM INFO</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-muted-foreground">VERSION:</span>
              <span className="text-foreground">2.001 Millennium</span>
              <span className="text-muted-foreground">BUILD:</span>
              <span className="text-foreground">20010101.1337</span>
              <span className="text-muted-foreground">CODENAME:</span>
              <span className="text-foreground">CyberWave</span>
              <span className="text-muted-foreground">LICENSE:</span>
              <span className="text-foreground">Hackers Only</span>
            </div>
          </div>

          <div className="border border-accent/30 rounded p-4 bg-accent/5">
            <h2 className="text-accent text-lg mb-2">// CREDITS</h2>
            <p className="text-foreground/80 text-xs">
              Inspired by Winamp, The Matrix, Windows 2000, and the early internet era.
              Made with love for the Y2K aesthetic.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-primary/20">
            <button className="chrome-button flex items-center gap-2 px-4 py-2 text-xs text-foreground">
              <ExternalLink className="h-3 w-3" />
              VISIT WEBSITE
            </button>
          </div>

          <div className="text-center text-xs text-muted-foreground pt-2">
            <p>Copyright (c) 2001 CyberSystems Inc.</p>
            <p className="text-primary/50">The future is now.</p>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
