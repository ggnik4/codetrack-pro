'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, hydrate } = useAuthStore()

  useEffect(() => {
    hydrate()

    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [isAuthenticated, router, hydrate])

  return null
}
