"use client"

import { useState, useEffect, useRef } from "react"
import { Terminal } from "lucide-react"
import { WindowFrame } from "./window-frame"

interface TerminalWindowProps {
  isActive: boolean
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
}

const bootSequence = [
  { text: "Y2K_OS v2.001 - Millennium Edition", delay: 100 },
  { text: "Copyright (c) 2001 CyberSystems Inc.", delay: 50 },
  { text: "", delay: 100 },
  { text: "Initializing audio subsystem... [OK]", delay: 200 },
  { text: "Loading visualizer drivers... [OK]", delay: 150 },
  { text: "Connecting to music database... [OK]", delay: 300 },
  { text: "Decrypting playlist cache... [OK]", delay: 250 },
  { text: "", delay: 100 },
  { text: "System ready.", delay: 100 },
  { text: "", delay: 50 },
]

const commands: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  help     - Show this help message",
    "  about    - About SpotifY2K",
    "  play     - Start playback",
    "  pause    - Pause playback",
    "  next     - Next track",
    "  prev     - Previous track",
    "  list     - Show playlist",
    "  matrix   - Enter the Matrix",
    "  clear    - Clear terminal",
  ],
  about: [
    "SpotifY2K - Retro Music Player",
    "Version: 2.001 (Millennium Edition)",
    "Build: 20010101",
    "",
    "A nostalgic music experience inspired by",
    "the golden age of the early 2000s.",
    "",
    "Hackers welcome.",
  ],
  play: [">> Initiating playback sequence...", ">> Audio stream active."],
  pause: [">> Playback suspended.", ">> Audio buffer preserved."],
  next: [">> Advancing to next track...", ">> Track loaded."],
  prev: [">> Rewinding to previous track...", ">> Track loaded."],
  list: [
    "Current Playlist:",
    "  01. Digital Dreams - CyberWave",
    "  02. Matrix Protocol - The Hackers",
    "  03. Y2K Bug - Millennium",
    "  04. Dial-Up Romance - 56K Modem",
    "  05. Screensaver Dreams - Winamp Legends",
    "  06. Boot Sequence - BIOS",
  ],
  matrix: [
    "Wake up, Neo...",
    "The Matrix has you...",
    "Follow the white rabbit.",
    "",
    "Knock, knock...",
  ],
}

export function TerminalWindow({ isActive, onClose, onMinimize, onFocus }: TerminalWindowProps) {
  const [lines, setLines] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [isBooting, setIsBooting] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Boot sequence
    let currentLine = 0
    let totalDelay = 0

    bootSequence.forEach((item, index) => {
      totalDelay += item.delay
      setTimeout(() => {
        setLines((prev) => [...prev, item.text])
        if (index === bootSequence.length - 1) {
          setIsBooting(false)
        }
      }, totalDelay)
    })
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isActive])

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    setLines((prev) => [...prev, `> ${cmd}`])

    if (trimmedCmd === "clear") {
      setLines([])
      return
    }

    if (commands[trimmedCmd]) {
      setLines((prev) => [...prev, ...commands[trimmedCmd]])
    } else if (trimmedCmd) {
      setLines((prev) => [
        ...prev,
        `Command not found: ${trimmedCmd}`,
        "Type 'help' for available commands.",
      ])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isBooting) {
      handleCommand(input)
      setInput("")
    }
  }

  return (
    <WindowFrame
      title="Terminal.exe"
      icon={<Terminal className="h-4 w-4" />}
      isActive={isActive}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      defaultPosition={{ x: 150, y: 200 }}
      defaultSize={{ width: 500, height: 350 }}
    >
      <div
        className="h-full bg-black/90 p-4 font-mono text-sm overflow-auto cursor-text"
        ref={terminalRef}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Output */}
        {lines.map((line, index) => (
          <div key={index} className="text-primary leading-relaxed whitespace-pre-wrap">
            {line}
          </div>
        ))}

        {/* Input Line */}
        {!isBooting && (
          <div className="flex items-center">
            <span className="text-accent mr-2">{">"}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-primary outline-none caret-primary"
              autoFocus
            />
            <span className="text-primary animate-pulse">_</span>
          </div>
        )}

        {/* Boot cursor */}
        {isBooting && (
          <div className="flex items-center">
            <span className="text-primary animate-pulse">_</span>
          </div>
        )}
      </div>
    </WindowFrame>
  )
}
