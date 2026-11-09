import { AppConfig } from "@/lib";
import axios, { type InternalAxiosRequestConfig } from "axios";
import type { ProblemDetails } from "./types";

export type HttpMethod = "post" | "put" | "patch" | "delete";

export const axiosInstance = axios.create({
  baseURL: AppConfig.apiUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const REFRESH_URL = "/auth/refresh";

/**
 * These run before a session exists, so refreshing can't help them, and on the
 * refresh call itself it would recurse.
 */
const UNAUTHENTICATED_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/onboard/signup",
  REFRESH_URL,
];

type RetriedConfig = InternalAxiosRequestConfig & { retried?: boolean };

let refreshing: Promise<unknown> | null = null;

/** Where an expired session lands, and the routes it should not bounce out of. */
const LOGIN_PATH = "/login";
const SIGNED_OUT_ROUTES = [LOGIN_PATH, "/create-account", "/verify-email"];

function signOut() {
  if (typeof window === "undefined") return;

  const { pathname } = window.location;
  if (SIGNED_OUT_ROUTES.some((route) => pathname.startsWith(route))) return;

  // A hard navigation on purpose: it drops any cached client state along with
  // the session, which a router push would leave behind.
  window.location.assign(LOGIN_PATH);
}

/** Single-flight: ten requests failing at once share one refresh, not ten. */
function refreshSession() {
  refreshing ??= axiosInstance.post(REFRESH_URL).finally(() => {
    refreshing = null;
  });

  return refreshing;
}

/**
 * The access token lasts 15 minutes and the session twelve hours, so an expired
 * access token should be invisible: refresh once, replay the request.
 */
axiosInstance.interceptors.response.use(undefined, async (error: unknown) => {
  if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;

  const request = error.config as RetriedConfig | undefined;
  const url = request?.url ?? "";

  if (
    !request ||
    request.retried ||
    UNAUTHENTICATED_PATHS.some((path) => url.startsWith(path))
  ) {
    throw error;
  }

  request.retried = true;

  try {
    await refreshSession();
  } catch {
    // The refresh cookie is gone or spent: the session is over, so send them
    // to sign in again rather than leaving a half-dead page behind a toast.
    signOut();
    throw error;
  }

  return axiosInstance(request);
});

/**
 * One backend now — access and lender are the same service. `service` stays
 * on every call site rather than being ripped out with the split, since
 * nothing here depends on it meaning two different base URLs anymore.
 */
export type ApiService = "access" | "lender";

const BASE_URLS: Record<ApiService, string> = {
  access: AppConfig.apiUrl,
  lender: AppConfig.apiUrl,
};

interface QueryOptions {
  params?: Record<string, unknown>;
  service?: ApiService;
}

export async function query<T>(
  url: string,
  { params, service = "access" }: QueryOptions = {},
): Promise<T> {
  const res = await axiosInstance.get<T>(url, {
    params,
    baseURL: BASE_URLS[service],
  });
  return res.data;
}

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (!axios.isAxiosError<Partial<ProblemDetails>>(err)) return fallback;
  return err.response?.data?.detail ?? fallback;
}

interface MutationOptions {
  contentType?: string;
  service?: ApiService;
}

export async function mutation<T = undefined>(
  url: string,
  method: HttpMethod,
  payload?: unknown,
  { contentType, service = "access" }: MutationOptions = {},
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && payload instanceof FormData;

  const res = await axiosInstance.request<T>({
    url,
    method,
    data: payload,
    baseURL: BASE_URLS[service],
    headers: {
      "Content-Type":
        contentType ?? (isFormData ? undefined : "application/json"),
    },
  });
  return res.data;
}
