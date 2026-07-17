import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const TOKEN_KEY = 'codetrack_auth_token'
const REFRESH_TOKEN_KEY = 'codetrack_refresh_token'

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: Record<string, any>
}

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken =
          typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null

        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/login/refresh/`, {
            refresh: refreshToken,
          })

          const { access } = response.data

          if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, access)
          }

          originalRequest.headers.Authorization = `Bearer ${access}`
          return httpClient(originalRequest)
        }
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const setAuthToken = (token: string, refreshToken?: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  }
}

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500
    const data = error.response?.data as Record<string, any>

    return {
      message: data?.message || data?.detail || error.message || 'An error occurred',
      status,
      code: data?.code,
      details: data,
    }
  }

  return {
    message: 'An unexpected error occurred',
    status: 500,
  }
}

export default httpClient
