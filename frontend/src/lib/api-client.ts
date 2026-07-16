import axios from "axios";

/**
 * Central Axios instance. All feature modules (contests, problems, goals...)
 * import this instead of creating their own client, so auth headers,
 * base URL, and interceptors stay in one place.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : "/api/backend",
  timeout: 15_000,
});

// Attaches the JWT access token once the auth store exists (Phase 2).
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
