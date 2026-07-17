import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import ThemeProvider from '@/components/providers/theme-provider'
import CommandPalette from '@/components/ui/command-palette'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const geist_mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'CodeTrack Pro - AI-Powered Developer Platform',
  description:
    'Manage your projects, issues, and team with AI-powered insights and analytics.',
  keywords: ['project management', 'issue tracking', 'developer tools', 'AI', 'analytics'],
  authors: [{ name: 'CodeTrack Team' }],
  openGraph: {
    title: 'CodeTrack Pro',
    description: 'AI-Powered Developer Platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geist_mono.variable} font-sans`}>
        <ThemeProvider>
          {children}
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  )
}
