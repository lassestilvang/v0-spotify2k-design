"use client"

import { Mic, MicOff, Radio } from "lucide-react"
import { useVoiceControl } from "@/hooks/use-voice-control"
import { useDJ } from "@/lib/dj-context"

interface VoiceControlPanelProps {
  onPlay?: () => void
  onPause?: () => void
  onNext?: () => void
  onPrevious?: () => void
  onVolumeUp?: () => void
  onVolumeDown?: () => void
}

export function VoiceControlPanel({
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onVolumeUp,
  onVolumeDown,
}: VoiceControlPanelProps) {
  const { respondToCommand, toggleRadioMode, isRadioMode } = useDJ()

  const commands = [
    {
      command: "play",
      aliases: ["resume", "start", "go"],
      action: () => {
        onPlay?.()
        respondToCommand("play")
      },
    },
    {
      command: "pause",
      aliases: ["stop", "hold"],
      action: () => {
        onPause?.()
        respondToCommand("pause")
      },
    },
    {
      command: "next",
      aliases: ["skip", "next track", "next song"],
      action: () => {
        onNext?.()
        respondToCommand("next")
      },
    },
    {
      command: "previous",
      aliases: ["back", "go back", "last track", "last song"],
      action: () => {
        onPrevious?.()
        respondToCommand("previous")
      },
    },
    {
      command: "volume up",
      aliases: ["louder", "turn it up", "increase volume"],
      action: () => {
        onVolumeUp?.()
        respondToCommand("volumeUp")
      },
    },
    {
      command: "volume down",
      aliases: ["quieter", "turn it down", "decrease volume", "lower"],
      action: () => {
        onVolumeDown?.()
        respondToCommand("volumeDown")
      },
    },
    {
      command: "radio mode",
      aliases: ["enable radio", "dj mode", "host mode"],
      action: () => {
        if (!isRadioMode) {
          toggleRadioMode()
        }
      },
    },
  ]

  const {
    isListening,
    isSupported,
    isAwake,
    lastTranscript,
    toggleListening,
  } = useVoiceControl({
    wakeWord: "hey dj",
    commands,
    onWake: () => {
      respondToCommand("wake")
    },
    onError: (error) => {
      console.error("Voice control error:", error)
    },
  })

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded border border-destructive/30 bg-destructive/10">
        <MicOff className="w-4 h-4 text-destructive" />
        <span className="text-xs font-mono text-destructive">VOICE NOT SUPPORTED</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 p-3 rounded border border-primary/30 bg-primary/5">
      {/* Status header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isListening 
              ? isAwake 
                ? "bg-primary animate-pulse" 
                : "bg-yellow-500 animate-pulse"
              : "bg-muted-foreground/50"
          }`} />
          <span className="text-xs font-mono text-muted-foreground">
            {isListening 
              ? isAwake 
                ? "LISTENING FOR COMMANDS" 
                : "WAITING FOR 'HEY DJ'"
              : "VOICE CONTROL OFF"
            }
          </span>
        </div>
        
        <button
          onClick={toggleListening}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all ${
            isListening
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted hover:bg-muted/80 text-foreground"
          }`}
        >
          {isListening ? (
            <>
              <Mic className="w-3 h-3" />
              ACTIVE
            </>
          ) : (
            <>
              <MicOff className="w-3 h-3" />
              ENABLE
            </>
          )}
        </button>
      </div>

      {/* Transcript display */}
      {isListening && lastTranscript && (
        <div className="p-2 rounded bg-black/30 border border-border">
          <div className="text-[10px] font-mono text-muted-foreground mb-1">DETECTED:</div>
          <p className="text-xs font-mono text-primary truncate">
            &quot;{lastTranscript}&quot;
          </p>
        </div>
      )}

      {/* Voice commands hint */}
      {isListening && (
        <div className="text-[10px] font-mono text-muted-foreground">
          COMMANDS: play, pause, next, previous, volume up/down, radio mode
        </div>
      )}
    </div>
  )
}
