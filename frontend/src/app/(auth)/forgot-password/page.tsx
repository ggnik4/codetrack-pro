'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft } from 'lucide-react'
import httpClient, { handleApiError } from '@/lib/http-client'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas'
import { useNotification } from '@/stores/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const notify = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)

    try {
      await httpClient.post('/auth/forgot-password/', data)
      notify.success('Password reset link sent to your email!')
      setSubmitted(true)
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
            <CardTitle className="text-2xl">Reset password</CardTitle>
            <CardDescription>
              {submitted
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive a password reset link'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                {/* Submit button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </Button>

                {/* Back to login */}
                <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                </p>

                <Link href="/login">
                  <Button className="w-full">Back to login</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
