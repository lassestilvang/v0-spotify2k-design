"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from "react"
import {
  stationIds,
  trackIntros,
  trackOutros,
  commercials,
  commentary,
  weatherReports,
  newsFlashes,
  voiceResponses,
  getRandomScript,
  getRandomResponse,
  getRadioSegment,
  type DJScript,
} from "./dj-scripts"

interface DJContextType {
  // State
  isRadioMode: boolean
  isSpeaking: boolean
  isListening: boolean
  lastSpoken: string
  djStatus: "idle" | "speaking" | "listening" | "processing"
  
  // Actions
  toggleRadioMode: () => void
  speak: (text: string) => Promise<void>
  speakScript: (script: DJScript) => Promise<void>
  announceTrackChange: () => Promise<void>
  playStationId: () => Promise<void>
  playCommercial: () => Promise<void>
  playWeather: () => Promise<void>
  playNews: () => Promise<void>
  playRadioSegment: () => Promise<void>
  respondToCommand: (command: keyof typeof voiceResponses) => Promise<void>
  stopSpeaking: () => void
}

const DJContext = createContext<DJContextType | null>(null)

export function DJProvider({ children }: { children: React.ReactNode }) {
  const [isRadioMode, setIsRadioMode] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [lastSpoken, setLastSpoken] = useState("")
  const [djStatus, setDjStatus] = useState<DJContextType["djStatus"]>("idle")
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const speakingLockRef = useRef<boolean>(false)
  const speechQueueRef = useRef<string[]>([])
  const isProcessingQueueRef = useRef<boolean>(false)

  // Clean up audio URL
  const cleanupAudio = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
  }, [])

  // Stop speaking and clear queue
  const stopSpeaking = useCallback(() => {
    // Clear the queue
    speechQueueRef.current = []
    isProcessingQueueRef.current = false
    speakingLockRef.current = false
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    cleanupAudio()
    setIsSpeaking(false)
    setDjStatus("idle")
  }, [cleanupAudio])

  // Internal speak function - plays audio directly without queue
  const speakInternal = useCallback(async (text: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsSpeaking(true)
        setDjStatus("speaking")
        setLastSpoken(text)
        speakingLockRef.current = true

        const response = await fetch("/api/elevenlabs/speak", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            voiceSettings: {
              stability: 0.4,
              similarity_boost: 0.8,
              style: 0.6,
              use_speaker_boost: true,
            },
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate speech")
        }

        const audioBlob = await response.blob()
        cleanupAudio()
        
        const audioUrl = URL.createObjectURL(audioBlob)
        audioUrlRef.current = audioUrl

        const audio = new Audio(audioUrl)
        audioRef.current = audio

        audio.onended = () => {
          setIsSpeaking(false)
          setDjStatus("idle")
          speakingLockRef.current = false
          cleanupAudio()
          resolve()
        }

        audio.onerror = () => {
          setIsSpeaking(false)
          setDjStatus("idle")
          speakingLockRef.current = false
          cleanupAudio()
          reject(new Error("Audio playback error"))
        }

        await audio.play()
      } catch (error) {
        console.error("Speech error:", error)
        setIsSpeaking(false)
        setDjStatus("idle")
        speakingLockRef.current = false
        reject(error)
      }
    })
  }, [cleanupAudio])

  // Process the speech queue
  const processQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || speechQueueRef.current.length === 0) {
      return
    }

    isProcessingQueueRef.current = true

    while (speechQueueRef.current.length > 0) {
      const text = speechQueueRef.current.shift()
      if (text) {
        try {
          await speakInternal(text)
          // Small pause between queued items
          if (speechQueueRef.current.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 300))
          }
        } catch (error) {
          console.error("Queue processing error:", error)
        }
      }
    }

    isProcessingQueueRef.current = false
  }, [speakInternal])

  // Core speak function - queues speech to prevent overlap
  const speak = useCallback(async (text: string) => {
    // If currently speaking, add to queue
    if (speakingLockRef.current) {
      speechQueueRef.current.push(text)
      return
    }

    // If queue is being processed, add to queue
    if (isProcessingQueueRef.current) {
      speechQueueRef.current.push(text)
      return
    }

    // Otherwise speak directly
    try {
      await speakInternal(text)
      // Process any queued items
      processQueue()
    } catch (error) {
      console.error("Speech error:", error)
    }
  }, [speakInternal, processQueue])

  // Speak a DJ script
  const speakScript = useCallback(async (script: DJScript) => {
    await speak(script.text)
  }, [speak])

  // Announce track change
  const announceTrackChange = useCallback(async () => {
    if (!isRadioMode) return
    const intro = getRandomScript(trackIntros)
    await speak(intro.text)
  }, [isRadioMode, speak])

  // Play station ID
  const playStationId = useCallback(async () => {
    const stationId = getRandomScript(stationIds)
    await speak(stationId.text)
  }, [speak])

  // Play commercial
  const playCommercial = useCallback(async () => {
    const commercial = getRandomScript(commercials)
    await speak(commercial.text)
  }, [speak])

  // Play weather
  const playWeather = useCallback(async () => {
    const weather = getRandomScript(weatherReports)
    await speak(weather.text)
  }, [speak])

  // Play news
  const playNews = useCallback(async () => {
    const news = getRandomScript(newsFlashes)
    await speak(news.text)
  }, [speak])

  // Play a full radio segment - queues all segments
  const playRadioSegment = useCallback(async () => {
    // Stop any current speech first
    stopSpeaking()
    
    // Small delay to ensure cleanup
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const segment = getRadioSegment()
    // Add all segments to queue
    for (const script of segment) {
      speechQueueRef.current.push(script.text)
    }
    // Start processing
    processQueue()
  }, [stopSpeaking, processQueue])

  // Respond to voice command
  const respondToCommand = useCallback(async (command: keyof typeof voiceResponses) => {
    const responses = voiceResponses[command]
    if (responses) {
      const response = getRandomResponse(responses)
      await speak(response)
    }
  }, [speak])

  // Track if we've announced radio mode to prevent double announcements
  const radioModeAnnouncedRef = useRef<boolean>(false)

  // Toggle radio mode
  const toggleRadioMode = useCallback(() => {
    setIsRadioMode(prev => {
      const newValue = !prev
      
      if (newValue && !radioModeAnnouncedRef.current) {
        // Stop any current speech first
        speechQueueRef.current = []
        isProcessingQueueRef.current = false
        speakingLockRef.current = false
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
        
        // Mark as announced to prevent double announcement
        radioModeAnnouncedRef.current = true
        
        // Small delay before announcing
        setTimeout(() => {
          speak(getRandomResponse(voiceResponses.radioMode))
        }, 150)
      } else if (!newValue) {
        // Reset announcement flag and clear queue when turning off
        radioModeAnnouncedRef.current = false
        speechQueueRef.current = []
      }
      
      return newValue
    })
  }, [speak, cleanupAudio])

  return (
    <DJContext.Provider
      value={{
        isRadioMode,
        isSpeaking,
        isListening,
        lastSpoken,
        djStatus,
        toggleRadioMode,
        speak,
        speakScript,
        announceTrackChange,
        playStationId,
        playCommercial,
        playWeather,
        playNews,
        playRadioSegment,
        respondToCommand,
        stopSpeaking,
      }}
    >
      {children}
    </DJContext.Provider>
  )
}

export function useDJ() {
  const context = useContext(DJContext)
  if (!context) {
    throw new Error("useDJ must be used within a DJProvider")
  }
  return context
}
