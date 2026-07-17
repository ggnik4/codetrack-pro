import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/lib/schemas'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean

  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) =>
        set({
          token,
        }),

      setLoading: (isLoading) =>
        set({
          isLoading,
        }),

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })

        if (typeof window !== 'undefined') {
          localStorage.removeItem('codetrack_auth_token')
          localStorage.removeItem('codetrack_refresh_token')
        }
      },

      hydrate: () => {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('codetrack_auth_token')
            : null

        if (token) {
          set({
            token,
            isAuthenticated: true,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
)