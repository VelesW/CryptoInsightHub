// Thin fetch wrapper that:
// 1. Always sends credentials (so the httpOnly session cookie travels).
// 2. Echoes the CSRF token cookie back as the X-CSRF-Token header on
//    state-changing requests (double-submit pattern).
//
// The server issues the CSRF cookie via GET /api/auth/csrf. We read it
// from document.cookie (it is intentionally not httpOnly).

const CSRF_COOKIE = "cih_csrf";
const CSRF_HEADER = "X-CSRF-Token";
const API_BASE = "/api";

function readCookie(name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + escaped + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export class ApiError extends Error {
  status: number;
  details?: Record<string, string[]>;
  constructor(
    message: string,
    status: number,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const method = opts.method ?? "GET";
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";

  if (method !== "GET") {
    const csrf = readCookie(CSRF_COOKIE);
    if (csrf) headers[CSRF_HEADER] = csrf;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });

  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");
  const payload: unknown = isJson ? await res.json() : null;

  if (!res.ok) {
    const p = (payload ?? {}) as {
      error?: string;
      details?: Record<string, string[]>;
    };
    throw new ApiError(p.error ?? `Request failed (${res.status})`, res.status, p.details);
  }
  return payload as T;
}

export async function ensureCsrfToken(): Promise<void> {
  if (readCookie(CSRF_COOKIE)) return;
  await api<{ csrfToken: string }>("/auth/csrf");
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
}

export const authApi = {
  csrf: () => api<{ csrfToken: string }>("/auth/csrf"),
  me: () => api<{ user: AuthUser }>("/auth/me"),
  login: (email: string, password: string) =>
    api<{ user: AuthUser }>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  register: (email: string, username: string, password: string) =>
    api<{ user: AuthUser }>("/auth/register", {
      method: "POST",
      body: { email, username, password },
    }),
  logout: () => api<{ ok: true }>("/auth/logout", { method: "POST" }),
};
