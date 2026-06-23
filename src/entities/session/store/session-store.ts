"use client";

import { create } from "zustand";
import type { UserResponse } from "@/entities/user/model/types";

const LEGACY_ACCESS_TOKEN_KEY = "accessToken";

type SessionState = {
  accessToken: string | null;
  user: UserResponse | null;
};

type SessionActions = {
  setSession: (accessToken: string, user: UserResponse) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: UserResponse) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState & SessionActions>((set) => ({
  accessToken: null,
  user: null,
  setSession: (accessToken, user) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  clearSession: () => set({ accessToken: null, user: null }),
}));

if (typeof window !== "undefined") {
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
}

export function getAccessToken(): string | null {
  return useSessionStore.getState().accessToken;
}

export function getSessionUser(): UserResponse | null {
  return useSessionStore.getState().user;
}

export function setSession(accessToken: string, user: UserResponse): void {
  useSessionStore.getState().setSession(accessToken, user);
}

export function setAccessToken(token: string): void {
  useSessionStore.getState().setAccessToken(token);
}

export function setSessionUser(user: UserResponse): void {
  useSessionStore.getState().setUser(user);
}

export function clearAccessToken(): void {
  useSessionStore.getState().clearSession();
}

export function clearSession(): void {
  useSessionStore.getState().clearSession();
}

export function useAccessToken(): string | null {
  return useSessionStore((state) => state.accessToken);
}

export function useSessionUser(): UserResponse | null {
  return useSessionStore((state) => state.user);
}
