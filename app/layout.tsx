import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { DJProvider } from '@/lib/dj-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SpotifY2K - Retro Music Player',
  description: 'A nostalgic Y2K-themed music application inspired by early 2000s hacker aesthetics',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className="font-mono antialiased bg-background text-foreground min-h-screen">
        <DJProvider>
          {children}
        </DJProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
