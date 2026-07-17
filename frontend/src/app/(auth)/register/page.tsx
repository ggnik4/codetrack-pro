'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import httpClient, { setAuthToken, handleApiError } from '@/lib/http-client'
import { registerSchema, type RegisterInput } from '@/lib/schemas'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/stores/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const notify = useNotification()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)

    try {
      const response = await httpClient.post('/auth/register/', {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
      })

      const { access, refresh, user } = response.data

      setAuthToken(access, refresh)
      setUser(user)
      setToken(access)

      notify.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error) {
      const apiError = handleApiError(error)
      notify.error(apiError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-lg">
                CT
              </div>
            </div>
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>Join CodeTrack Pro today</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* First name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">First name</label>
                <Input
                  {...register('firstName')}
                  placeholder="John"
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Last name</label>
                <Input
                  {...register('lastName')}
                  placeholder="Doe"
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName.message}</p>
                )}
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm password</label>
                <Input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>

              {/* Sign in link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
