# SpotifY2K

A nostalgic, retro-themed music application inspired by early 2000s hacker aesthetics. Experience what Spotify might have looked like if it were designed in 2001 by hackers.

## Features

### Fake Desktop OS Environment
- Matrix rain background animation with falling characters
- Draggable and resizable translucent windows with chrome-style title bars
- Windows 2000-style taskbar with system tray and clock
- Desktop icons for launching applications

### Music Player
- Album art area with embedded audio visualizer
- Full playback controls with chrome metallic buttons
- Progress bar and volume slider
- Playlist view with track listing

### Audio-Reactive Visualizers
- Bar visualizer with neon gradient colors
- Waveform oscilloscope display
- Circular rotating visualizer
- Real-time frequency and amplitude stats

### AI DJ Voice Assistant (NEXUS-DJ)
- Powered by ElevenLabs text-to-speech
- Cyberpunk persona with glitchy animated avatar
- Quick actions for station IDs, track intros, and commentary
- Fake Y2K commercials and weather reports

### Radio Host Mode
- Automatic DJ announcements between tracks
- Station IDs every few tracks
- Visual indicator when DJ is speaking

### Voice-Controlled Playback
- Commands: play, pause, stop, next, previous, volume up/down
- Optional "Hey DJ" wake word
- Visual feedback for listening state

### Terminal Window
- Interactive command-line interface
- Hacker-themed commands and easter eggs

## Y2K Visual Effects
- CRT scanline overlay
- Neon glow text effects
- Chrome/metallic button gradients
- Translucent glass window effects
- Matrix-themed color palette

## Tech Stack

- **Framework:** Next.js 16
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Text-to-Speech:** ElevenLabs API
- **Voice Recognition:** Web Speech API

## Environment Variables

```env
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_VOICE_ID=optional_custom_voice_id
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Built with v0

This project was built with [v0](https://v0.app).

[Continue working on v0](https://v0.app/chat/projects/prj_nTrNYJ60y85nns4GFXvxj40TZQa0)

## License

MIT
