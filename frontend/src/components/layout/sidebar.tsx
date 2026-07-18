'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Zap,
  Settings,
  User,
  LogOut,
  Menu,
} from 'lucide-react'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FolderOpen, label: 'Projects', href: '/dashboard/projects' },
  { icon: CheckSquare, label: 'Issues', href: '/dashboard/issues' },
  { icon: Zap, label: 'Insights', href: '/dashboard/insights' },
]

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile toggle */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 z-30 h-screen w-64 border-r border-sidebar-border bg-sidebar lg:relative lg:z-0 lg:ml-0"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-sidebar-border p-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
                CT
              </div>
              <span className="text-lg font-bold text-sidebar-foreground">CodeTrack</span>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className="space-y-2 p-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.button
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </motion.button>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Bottom items */}
          <div className="border-t border-sidebar-border p-4 space-y-2">
            {bottomItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link key={item.href} href={item.href}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    className={`w-full flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </motion.button>
                </Link>
              )
            })}

            {/* Logout */}
            <motion.button
              whileHover={{ x: 4 }}
              onClick={logout}
              className="w-full flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Logout</span>
            </motion.button>
          </div>

          {/* User profile */}
          {user && (
            <div className="border-t border-sidebar-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
                  {user?.full_name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-sidebar-foreground truncate">
                  {user.full_name || user.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  )
}
