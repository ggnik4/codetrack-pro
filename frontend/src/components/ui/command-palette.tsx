'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Zap,
  Settings,
  User,
  X,
} from 'lucide-react'
import { useUIStore } from '@/stores/ui'
import { Input } from '@/components/ui/input'

const commands = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FolderOpen, label: 'Projects', href: '/dashboard/projects' },
  { icon: CheckSquare, label: 'Issues', href: '/dashboard/issues' },
  { icon: Zap, label: 'Insights', href: '/dashboard/insights' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
]

export default function CommandPalette() {
  const router = useRouter()
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore()
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }

      if (!commandPaletteOpen) return

      switch (e.key) {
        case 'Escape':
          setCommandPaletteOpen(false)
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev === 0 ? filteredCommands.length - 1 : prev - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            router.push(filteredCommands[selectedIndex].href)
            setCommandPaletteOpen(false)
            setSearch('')
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, selectedIndex, filteredCommands, router, setCommandPaletteOpen])

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Command palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-lg border border-border bg-card shadow-lg"
          >
            {/* Search input */}
            <div className="flex items-center border-b border-border px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search commands..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setSelectedIndex(0)
                }}
                className="border-0 bg-transparent pl-3 focus-visible:ring-0"
              />
              <button
                onClick={() => setCommandPaletteOpen(false)}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Commands list */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon
                  const isSelected = idx === selectedIndex

                  return (
                    <motion.button
                      key={cmd.href}
                      onClick={() => {
                        router.push(cmd.href)
                        setCommandPaletteOpen(false)
                        setSearch('')
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{cmd.label}</span>
                    </motion.button>
                  )
                })
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No commands found
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>
                  {filteredCommands.length > 0 && (
                    <>
                      <kbd className="rounded bg-muted px-2 py-1">↑↓</kbd>
                      <span className="mx-2">to navigate</span>
                      <kbd className="rounded bg-muted px-2 py-1">↵</kbd>
                      <span className="mx-2">to select</span>
                    </>
                  )}
                </span>
                <kbd className="rounded bg-muted px-2 py-1">esc</kbd>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
