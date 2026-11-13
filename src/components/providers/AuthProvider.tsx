"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { sleep } from "@/lib/utils";

/**
 * Frontend-only authentication state.
 *
 * There is NO backend connected: `signIn` and `signUp` simulate a request,
 * run basic checks and store a session object in web storage so the UI can
 * demonstrate signed-in and signed-out states. Replace the two functions with
 * real API calls (e.g. POST /auth/login on the FastAPI backend) when available.
 */

export interface SessionUser {
  name: string;
  email: string;
  organization?: string;
}

interface AuthContextValue {
  user: SessionUser | null;
  /** False during server render / hydration, true once client storage is read. */
  ready: boolean;
  signIn: (input: { email: string; password: string; remember: boolean }) => Promise<void>;
  signUp: (input: { name: string; email: string; password: string; organization?: string }) => Promise<void>;
  signOut: () => void;
}

const STORAGE_KEY = "archopt.session";

/* ---- tiny external store over web storage (works with useSyncExternalStore) ---- */
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

function writeSession(user: SessionUser | null, remember: boolean) {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
    if (user) {
      (remember ? window.localStorage : window.sessionStorage).setItem(STORAGE_KEY, JSON.stringify(user));
    }
  } catch {
    /* storage may be unavailable (private mode, quota) */
  }
  listeners.forEach((l) => l());
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const user = useMemo<SessionUser | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SessionUser;
    } catch {
      return null;
    }
  }, [raw]);

  const signIn = useCallback<AuthContextValue["signIn"]>(async ({ email, password, remember }) => {
    await sleep(700); // simulate network latency
    // Demo rule: any valid email signs in, except a reserved address / password
    // used to demonstrate the error state.
    if (email.toLowerCase() === "blocked@archopt.dev" || password === "wrongpassword") {
      throw new Error("Incorrect email or password.");
    }
    const name = email
      .split("@")[0]
      .split(/[._-]/)
      .filter(Boolean)
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join(" ");
    writeSession({ name: name || "ArchOpt User", email }, remember);
  }, []);

  const signUp = useCallback<AuthContextValue["signUp"]>(async ({ name, email, organization }) => {
    await sleep(900);
    if (email.toLowerCase() === "taken@archopt.dev") {
      throw new Error("An account with this email already exists.");
    }
    writeSession({ name, email, organization }, true);
  }, []);

  const signOut = useCallback(() => writeSession(null, false), []);

  const value = useMemo(() => ({ user, ready, signIn, signUp, signOut }), [user, ready, signIn, signUp, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
