import { apiClient } from "@/lib/api-client";
import type { LoginResponse, User } from "@/types/user";

export interface RegisterPayload {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<{ detail: string }>("/auth/register/", payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>("/auth/login/", payload).then((r) => r.data),

  logout: (refresh: string) =>
    apiClient.post("/auth/logout/", { refresh }).then((r) => r.data),

  verifyEmail: (uid: string, token: string) =>
    apiClient.post<{ detail: string }>("/auth/verify-email/", { uid, token }).then((r) => r.data),

  resendVerification: () =>
    apiClient.post<{ detail: string }>("/auth/verify-email/resend/").then((r) => r.data),

  requestPasswordReset: (email: string) =>
    apiClient.post<{ detail: string }>("/auth/password-reset/", { email }).then((r) => r.data),

  confirmPasswordReset: (uid: string, token: string, new_password: string) =>
    apiClient
      .post<{ detail: string }>("/auth/password-reset/confirm/", { uid, token, new_password })
      .then((r) => r.data),

  socialLogin: (provider: "google" | "github", payload: Record<string, string>) =>
    apiClient.post<LoginResponse>(`/auth/social/${provider}/`, payload).then((r) => r.data),

  me: () => apiClient.get<User>("/auth/me/").then((r) => r.data),

  updateMe: (payload: Partial<User>) =>
    apiClient.patch<User>("/auth/me/", payload).then((r) => r.data),
};
