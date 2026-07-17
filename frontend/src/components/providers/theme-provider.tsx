'use client'

import React, { ReactNode } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface ThemeProviderProps {
  children: ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey="codetrack-theme"
      forcedTheme={undefined}
    >
      {children}
    </NextThemesProvider>
  )
}
