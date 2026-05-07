// NEXUS-DJ: Cyberpunk Radio Host Scripts for SpotifY2K
// Voice: Deep, slightly robotic, with Y2K enthusiasm

export interface DJScript {
  id: string
  type: "intro" | "outro" | "station_id" | "commercial" | "commentary" | "weather" | "news"
  text: string
  tags?: string[]
}

// Station identification scripts
export const stationIds: DJScript[] = [
  {
    id: "station_1",
    type: "station_id",
    text: "You're jacked into NEXUS FM, broadcasting from the neon grid at 2000 megahertz. This is SpotifY2K, where the future sounds retro.",
  },
  {
    id: "station_2",
    type: "station_id",
    text: "NEXUS FM. Pirate frequencies. Encrypted beats. Welcome to the underground.",
  },
  {
    id: "station_3",
    type: "station_id",
    text: "Streaming live from Sector 7, Neo-Tokyo time zone. You're locked into SpotifY2K.",
  },
  {
    id: "station_4",
    type: "station_id",
    text: "This signal cannot be traced. NEXUS FM, the voice of the digital resistance.",
  },
  {
    id: "station_5",
    type: "station_id",
    text: "Frequency locked. Firewall bypassed. Welcome back to NEXUS FM, runner.",
  },
]

// Track intro scripts (with placeholders for track/artist names)
export const trackIntros: DJScript[] = [
  {
    id: "intro_1",
    type: "intro",
    text: "Incoming transmission. Next track loading into the mainframe. Prepare for audio upload.",
  },
  {
    id: "intro_2",
    type: "intro",
    text: "Data stream detected. This next one's fresh from the underground servers.",
  },
  {
    id: "intro_3",
    type: "intro",
    text: "Decrypting audio file. Stand by for the next sonic payload.",
  },
  {
    id: "intro_4",
    type: "intro",
    text: "New frequency locked. Initializing playback sequence.",
  },
  {
    id: "intro_5",
    type: "intro",
    text: "The algorithm has chosen. Let the waveforms flow.",
  },
]

// Track outro scripts
export const trackOutros: DJScript[] = [
  {
    id: "outro_1",
    type: "outro",
    text: "That signal's fading out. But don't disconnect, we've got more incoming.",
  },
  {
    id: "outro_2",
    type: "outro",
    text: "Audio stream complete. Buffering next transmission.",
  },
  {
    id: "outro_3",
    type: "outro",
    text: "End of line. But the night is still young in the neon district.",
  },
]

// Fake Y2K commercials
export const commercials: DJScript[] = [
  {
    id: "commercial_1",
    type: "commercial",
    text: "Tired of corporate surveillance? Try NetMask Pro. Your identity, encrypted. Your data, protected. NetMask Pro, because privacy is not a crime. Available at your local data haven.",
  },
  {
    id: "commercial_2",
    type: "commercial",
    text: "Upgrade your neural interface with CyberDyne's new X-9000 processor. Faster thoughts. Sharper reflexes. Side effects may include vivid dreams and temporary time dilation. CyberDyne, think beyond human.",
  },
  {
    id: "commercial_3",
    type: "commercial",
    text: "Neon Ramen, the official fuel of the underground. Now available in new flavors: Electric Miso and Binary Beef. Neon Ramen, eat the future.",
  },
  {
    id: "commercial_4",
    type: "commercial",
    text: "Is your firewall feeling weak? Download IceBreaker 2000. Military grade encryption. Zero trace browsing. IceBreaker, because they're always watching.",
  },
  {
    id: "commercial_5",
    type: "commercial",
    text: "Visit the Akira Arcade, Sector 12. Vintage games. Crypto accepted. No questions asked. Akira Arcade, where legends respawn.",
  },
]

// Random cyberpunk commentary
export const commentary: DJScript[] = [
  {
    id: "comment_1",
    type: "commentary",
    text: "The megacorps think they own the airwaves. But out here, in the digital shadows, we still control the music.",
  },
  {
    id: "comment_2",
    type: "commentary",
    text: "Remember, runner, in a world of ones and zeros, music is the only thing that still feels analog.",
  },
  {
    id: "comment_3",
    type: "commentary",
    text: "They said the year 2000 would break all the computers. Jokes on them. We're still here, broadcasting from the future's past.",
  },
  {
    id: "comment_4",
    type: "commentary",
    text: "Keep your connections encrypted and your playlists diverse. This is the way.",
  },
  {
    id: "comment_5",
    type: "commentary",
    text: "Shoutout to all the night owls, the code jockeys, and the digital dreamers. This frequency is for you.",
  },
]

// Fake cyber weather reports
export const weatherReports: DJScript[] = [
  {
    id: "weather_1",
    type: "weather",
    text: "Cyber weather update. Expect heavy data rain in sectors 4 through 7. Firewall visibility low. Perfect conditions for staying jacked in.",
  },
  {
    id: "weather_2",
    type: "weather",
    text: "Tonight's forecast: Neon fog with a chance of electromagnetic interference. Satellite uplinks may experience delays.",
  },
  {
    id: "weather_3",
    type: "weather",
    text: "Grid status: Stable. Solar flare activity: Minimal. Ideal night for deep web exploration.",
  },
]

// Fake news bulletins
export const newsFlashes: DJScript[] = [
  {
    id: "news_1",
    type: "news",
    text: "Breaking: Anonymous hackers have liberated another music archive from corporate servers. The people's library grows stronger.",
  },
  {
    id: "news_2",
    type: "news",
    text: "Update from the Net: New encryption protocols released. Your streams are now 40 percent more untraceable.",
  },
  {
    id: "news_3",
    type: "news",
    text: "Rumor from the underground: A legendary DJ from the old web is planning a comeback. Stay tuned for more.",
  },
]

// Voice command responses
export const voiceResponses = {
  wake: [
    "NEXUS DJ online. What's your command, runner?",
    "Voice link established. I'm listening.",
    "Audio interface activated. Speak your request.",
  ],
  play: [
    "Initiating playback sequence.",
    "Audio stream resuming.",
    "Beats incoming.",
  ],
  pause: [
    "Playback suspended. Standing by.",
    "Audio paused. Awaiting further instructions.",
    "Stream on hold.",
  ],
  next: [
    "Skipping to next transmission.",
    "Loading next track from the queue.",
    "Advancing audio sequence.",
  ],
  previous: [
    "Rewinding to previous track.",
    "Loading prior transmission.",
    "Going back in the playlist.",
  ],
  volumeUp: [
    "Amplifying signal.",
    "Boosting audio output.",
    "Volume increased.",
  ],
  volumeDown: [
    "Reducing signal strength.",
    "Lowering audio levels.",
    "Volume decreased.",
  ],
  radioMode: [
    "Radio host mode engaged. Prepare for the full NEXUS experience.",
    "Activating DJ protocols. Let's make this a show.",
  ],
  error: [
    "Command not recognized. Try again, runner.",
    "Signal unclear. Please repeat.",
    "Unable to process. Rephrase your request.",
  ],
}

// Helper function to get random script from a category
export function getRandomScript(scripts: DJScript[]): DJScript {
  return scripts[Math.floor(Math.random() * scripts.length)]
}

export function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)]
}

// Get a full radio segment (station ID + commentary or commercial)
export function getRadioSegment(): DJScript[] {
  const segment: DJScript[] = []
  
  // Always start with station ID
  segment.push(getRandomScript(stationIds))
  
  // Random content type
  const rand = Math.random()
  if (rand < 0.3) {
    segment.push(getRandomScript(commercials))
  } else if (rand < 0.5) {
    segment.push(getRandomScript(weatherReports))
  } else if (rand < 0.7) {
    segment.push(getRandomScript(newsFlashes))
  } else {
    segment.push(getRandomScript(commentary))
  }
  
  return segment
}
