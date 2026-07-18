'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Bell, Users, Palette, ChevronRight, ToggleRight, ToggleLeft } from 'lucide-react'
import LayoutShell from '@/components/layout/layout-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SettingToggle {
  id: string
  label: string
  description: string
  enabled: boolean
}

const settingsSections = [
  {
    title: 'Account Settings',
    icon: Settings,
    items: [
      { label: 'Profile Information', description: 'Update your name and email' },
      { label: 'Password & Security', description: 'Change password and security settings' },
      { label: 'Two-Factor Authentication', description: 'Enable 2FA for added security' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    items: [
      { label: 'Email Notifications', description: 'Manage email notification preferences' },
      { label: 'Slack Integration', description: 'Connect Slack for notifications' },
      { label: 'Notification Schedule', description: 'Set quiet hours and notification times' },
    ],
  },
  {
    title: 'Team & Permissions',
    icon: Users,
    items: [
      { label: 'Team Members', description: 'Manage team members and roles' },
      { label: 'Permissions', description: 'Configure access levels' },
      { label: 'Invitations', description: 'Invite new team members' },
    ],
  },
  {
    title: 'Appearance',
    icon: Palette,
    items: [
      { label: 'Theme', description: 'Choose between light and dark theme' },
      { label: 'Language', description: 'Select your preferred language' },
      { label: 'Timezone', description: 'Set your timezone' },
    ],
  },
]

const notificationToggles: SettingToggle[] = [
  {
    id: 'issue-assigned',
    label: 'Issue Assigned',
    description: 'Notify me when an issue is assigned to me',
    enabled: true,
  },
  {
    id: 'issue-commented',
    label: 'Issue Commented',
    description: 'Notify me when someone comments on my issues',
    enabled: true,
  },
  {
    id: 'project-updated',
    label: 'Project Updated',
    description: 'Notify me when a project is updated',
    enabled: false,
  },
]

export default function SettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState(notificationToggles)

  const toggleNotification = (id: string) => {
    setNotificationSettings(
      notificationSettings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    )
  }

  return (
    <LayoutShell>
      <div className="space-y-8 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="mt-1 text-muted-foreground">Manage your account and preferences</p>
          </div>
        </motion.div>

        {/* Settings sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {settingsSections.map((section, idx) => {
            const Icon = section.icon

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{section.title}</CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {section.items.map((item, itemIdx) => (
                        <motion.button
                          key={itemIdx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: itemIdx * 0.1 }}
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                        >
                          <div>
                            <p className="font-medium text-sm">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Notification preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose which notifications you want to receive</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {notificationSettings.map((setting, idx) => (
                  <motion.div
                    key={setting.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{setting.label}</p>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>

                    <button
                      onClick={() => toggleNotification(setting.id)}
                      className="flex-shrink-0 ml-4"
                    >
                      {setting.enabled ? (
                        <ToggleRight className="h-6 w-6 text-primary" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 justify-end"
        >
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </motion.div>
      </div>
    </LayoutShell>
  )
}
