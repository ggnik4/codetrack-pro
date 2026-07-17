'use client'

import React, { ReactNode } from 'react'
import Sidebar from './sidebar'
import Topbar from './topbar'

interface LayoutShellProps {
  children: ReactNode
}

export default function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
