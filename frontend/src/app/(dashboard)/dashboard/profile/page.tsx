'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Edit2, Save, X, Upload, Loader2 } from 'lucide-react'
import LayoutShell from '@/components/layout/layout-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/schemas'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/stores/ui'

export default function ProfilePage() {
// ... rest remains same
  const { user, setUser } = useAuthStore()
  const notify = useNotification()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.full_name?.split(' ')[0] || '',
      lastName: user?.full_name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
    },
  })

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Update the store with the new data
      if (user) {
        setUser({
          ...user,
          ...data,
        })
      }
      
      notify.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      notify.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="mt-1 text-muted-foreground">Manage your profile information</p>
            </div>
            <Button
              variant={isEditing ? 'outline' : 'default'}
              onClick={() => {
                if (isEditing) {
                  reset()
                }
                setIsEditing(!isEditing)
              }}
            >
              {isEditing ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/20 text-4xl font-bold text-primary"
                  >
                    {(
                      user?.full_name?.charAt(0) ||
                      user?.username?.charAt(0) ||
                      "U"
                    ).toUpperCase()}
                  </motion.div>

                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Change Avatar
                    </Button>
                  )}
                </div>

                {/* Profile info */}
                <div className="flex-1">
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p className="text-lg font-semibold mt-1">
                          {user?.full_name?.trim() ? user.full_name : user?.username}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-lg font-semibold mt-1">{user?.email}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                        <div className="mt-1">
                          <Badge>{user?.is_email_verified ? 'Verified' : 'Unverified'}</Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          <Input
                            {...register('firstName')}
                            placeholder="John"
                            disabled={isLoading}
                          />
                          {errors.firstName && (
                            <p className="text-xs text-destructive">{errors.firstName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          <Input
                            {...register('lastName')}
                            placeholder="Doe"
                            disabled={isLoading}
                          />
                          {errors.lastName && (
                            <p className="text-xs text-destructive">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          {...register('email')}
                          type="email"
                          placeholder="you@example.com"
                          disabled={isLoading}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-sm">Password</p>
                  <p className="text-xs text-muted-foreground">Last changed 2 months ago</p>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Not enabled</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </LayoutShell>
  )
}
