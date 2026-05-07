"use client"

import { useState, useEffect } from "react"
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart } from "lucide-react"
import { WindowFrame } from "./window-frame"
import { AudioVisualizer } from "./audio-visualizer"

interface MusicPlayerWindowProps {
  isActive: boolean
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
}

const mockPlaylist = [
  { id: 1, title: "Digital Dreams", artist: "CyberWave", duration: "3:45", album: "Neon Nights" },
  { id: 2, title: "Matrix Protocol", artist: "The Hackers", duration: "4:12", album: "System32" },
  { id: 3, title: "Y2K Bug", artist: "Millennium", duration: "3:28", album: "End of Days" },
  { id: 4, title: "Dial-Up Romance", artist: "56K Modem", duration: "5:01", album: "AOL Memories" },
  { id: 5, title: "Screensaver Dreams", artist: "Winamp Legends", duration: "4:33", album: "Skins" },
  { id: 6, title: "Boot Sequence", artist: "BIOS", duration: "2:58", album: "POST" },
]

export function MusicPlayerWindow({ isActive, onClose, onMinimize, onFocus }: MusicPlayerWindowProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(75)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5))
    }, 100)
    return () => clearInterval(interval)
  }, [isPlaying])

  const currentSong = mockPlaylist[currentTrack]

  return (
    <WindowFrame
      title="SpotifY2K.exe"
      icon={<Music className="h-4 w-4" />}
      isActive={isActive}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      defaultPosition={{ x: 80, y: 40 }}
      defaultSize={{ width: 700, height: 500 }}
    >
      <div className="flex h-full flex-col bg-gradient-to-b from-background/50 to-background p-4">
        {/* Now Playing Section */}
        <div className="flex gap-4 pb-4 border-b border-primary/20">
          {/* Album Art with Visualizer */}
          <div className="relative h-32 w-32 shrink-0 rounded-sm border border-primary/30 bg-card overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <AudioVisualizer isPlaying={isPlaying} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <Music className="h-12 w-12 text-primary/50" />
            </div>
          </div>

          {/* Track Info */}
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">NOW_PLAYING://</span>
            </div>
            <h2 className="text-xl font-bold text-primary truncate crt-glow">
              {currentSong.title}
            </h2>
            <p className="text-sm text-foreground/70 truncate">{currentSong.artist}</p>
            <p className="text-xs text-muted-foreground truncate">{currentSong.album}</p>
            
            {/* Progress Bar */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono tabular-nums w-10">
                {Math.floor(progress * 2.25 / 60)}:{String(Math.floor(progress * 2.25 % 60)).padStart(2, '0')}
              </span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-mono w-10">{currentSong.duration}</span>
            </div>
          </div>

          {/* Like Button */}
          <button className="self-start p-2 hover:bg-primary/10 rounded transition-colors">
            <Heart className="h-5 w-5 text-primary/50 hover:text-neon-pink" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 py-4 border-b border-primary/20">
          <button className="p-2 hover:bg-primary/10 rounded transition-colors">
            <Shuffle className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </button>
          <button 
            onClick={() => setCurrentTrack(Math.max(0, currentTrack - 1))}
            className="chrome-button p-2"
          >
            <SkipBack className="h-5 w-5 text-foreground" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="chrome-button p-3 rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-primary" />
            ) : (
              <Play className="h-6 w-6 text-primary ml-0.5" />
            )}
          </button>
          <button 
            onClick={() => setCurrentTrack(Math.min(mockPlaylist.length - 1, currentTrack + 1))}
            className="chrome-button p-2"
          >
            <SkipForward className="h-5 w-5 text-foreground" />
          </button>
          <button className="p-2 hover:bg-primary/10 rounded transition-colors">
            <Repeat className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-primary/20">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>
        </div>

        {/* Playlist */}
        <div className="flex-1 overflow-auto mt-2">
          <div className="text-xs text-muted-foreground font-mono mb-2 flex items-center gap-2">
            <span>PLAYLIST://</span>
            <span className="text-primary">{mockPlaylist.length} tracks</span>
          </div>
          <div className="space-y-1">
            {mockPlaylist.map((track, index) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrack(index)
                  setProgress(0)
                }}
                className={`w-full flex items-center gap-3 p-2 rounded-sm text-left transition-all ${
                  index === currentTrack
                    ? "bg-primary/20 border border-primary/40"
                    : "hover:bg-primary/10 border border-transparent"
                }`}
              >
                <span className="w-6 text-xs text-muted-foreground font-mono tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {index === currentTrack && isPlaying ? (
                  <div className="flex items-end gap-0.5 h-4 w-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary animate-pulse"
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <Music className="h-4 w-4 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${index === currentTrack ? "text-primary" : "text-foreground"}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{track.duration}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-2 pt-2 border-t border-primary/20 flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>STATUS: {isPlaying ? "PLAYING" : "PAUSED"}</span>
          <span>CODEC: MP3 320kbps</span>
          <span>BUFFER: 100%</span>
        </div>
      </div>
    </WindowFrame>
  )
}
