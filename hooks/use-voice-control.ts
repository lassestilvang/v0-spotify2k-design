"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface VoiceCommand {
  command: string
  aliases: string[]
  action: () => void
}

interface UseVoiceControlOptions {
  wakeWord?: string
  commands: VoiceCommand[]
  onWake?: () => void
  onCommand?: (command: string) => void
  onError?: (error: string) => void
  continuous?: boolean
}

interface UseVoiceControlReturn {
  isListening: boolean
  isSupported: boolean
  isAwake: boolean
  lastTranscript: string
  startListening: () => void
  stopListening: () => void
  toggleListening: () => void
}

export function useVoiceControl({
  wakeWord = "hey dj",
  commands,
  onWake,
  onCommand,
  onError,
  continuous = true,
}: UseVoiceControlOptions): UseVoiceControlReturn {
  const [isListening, setIsListening] = useState(false)
  const [isAwake, setIsAwake] = useState(false)
  const [lastTranscript, setLastTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const awakeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
  }, [])

  // Process transcript for commands
  const processTranscript = useCallback((transcript: string) => {
    const lowerTranscript = transcript.toLowerCase().trim()
    setLastTranscript(transcript)

    // Check for wake word
    if (lowerTranscript.includes(wakeWord.toLowerCase())) {
      setIsAwake(true)
      onWake?.()
      
      // Reset awake timeout
      if (awakeTimeoutRef.current) {
        clearTimeout(awakeTimeoutRef.current)
      }
      awakeTimeoutRef.current = setTimeout(() => {
        setIsAwake(false)
      }, 10000) // Stay awake for 10 seconds after wake word
      
      return
    }

    // Only process commands if awake or if continuous listening
    if (!isAwake && !continuous) return

    // Check for commands
    for (const cmd of commands) {
      const allTriggers = [cmd.command.toLowerCase(), ...cmd.aliases.map(a => a.toLowerCase())]
      
      for (const trigger of allTriggers) {
        if (lowerTranscript.includes(trigger)) {
          cmd.action()
          onCommand?.(cmd.command)
          
          // Reset awake timeout on command
          if (awakeTimeoutRef.current) {
            clearTimeout(awakeTimeoutRef.current)
          }
          awakeTimeoutRef.current = setTimeout(() => {
            setIsAwake(false)
          }, 10000)
          
          return
        }
      }
    }
  }, [wakeWord, commands, isAwake, continuous, onWake, onCommand])

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      const results = event.results
      const lastResult = results[results.length - 1]
      
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript
        processTranscript(transcript)
      }
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      if (event.error !== "no-speech" && event.error !== "aborted") {
        onError?.(event.error)
      }
    }

    recognition.onend = () => {
      // Restart if still supposed to be listening
      if (isListening) {
        try {
          recognition.start()
        } catch (e) {
          // Already started
        }
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
      if (awakeTimeoutRef.current) {
        clearTimeout(awakeTimeoutRef.current)
      }
    }
  }, [isSupported, isListening, processTranscript, onError])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return
    
    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (e) {
      // Already started
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    
    recognitionRef.current.stop()
    setIsListening(false)
    setIsAwake(false)
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    isSupported,
    isAwake,
    lastTranscript,
    startListening,
    stopListening,
    toggleListening,
  }
}

// Add TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}
