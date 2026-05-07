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

  // Clean up audio URL
  const cleanupAudio = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
  }, [])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    cleanupAudio()
    setIsSpeaking(false)
    setDjStatus("idle")
  }, [cleanupAudio])

  // Core speak function using ElevenLabs API
  const speak = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true)
      setDjStatus("speaking")
      setLastSpoken(text)

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
        cleanupAudio()
      }

      audio.onerror = () => {
        setIsSpeaking(false)
        setDjStatus("idle")
        cleanupAudio()
      }

      await audio.play()
    } catch (error) {
      console.error("Speech error:", error)
      setIsSpeaking(false)
      setDjStatus("idle")
    }
  }, [cleanupAudio])

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

  // Play a full radio segment
  const playRadioSegment = useCallback(async () => {
    const segment = getRadioSegment()
    for (const script of segment) {
      await speak(script.text)
      // Small pause between segments
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }, [speak])

  // Respond to voice command
  const respondToCommand = useCallback(async (command: keyof typeof voiceResponses) => {
    const responses = voiceResponses[command]
    if (responses) {
      const response = getRandomResponse(responses)
      await speak(response)
    }
  }, [speak])

  // Toggle radio mode
  const toggleRadioMode = useCallback(() => {
    setIsRadioMode(prev => {
      const newValue = !prev
      if (newValue) {
        // Announce radio mode activation
        speak(getRandomResponse(voiceResponses.radioMode))
      }
      return newValue
    })
  }, [speak])

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
