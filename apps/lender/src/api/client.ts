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
 * These run before a session exists or end one, so refreshing can't help them,
 * and on the refresh call itself it would recurse.
 */
const UNAUTHENTICATED_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/auth/logout",
  "/onboarding/lender",
  REFRESH_URL,
];

type RetriedConfig = InternalAxiosRequestConfig & { retried?: boolean };

let refreshing: Promise<unknown> | null = null;

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
    signOut();
    throw error;
  }

  return axiosInstance(request);
});

export async function query<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const res = await axiosInstance.get<T>(url, { params });
  return res.data;
}

export function readProblem(err: unknown) {
  return axios.isAxiosError<Partial<ProblemDetails>>(err)
    ? err.response?.data
    : undefined;
}

export function readStatus(err: unknown) {
  return axios.isAxiosError(err) ? err.response?.status : undefined;
}

export function extractErrorMessage(err: unknown, fallback: string): string {
  return readProblem(err)?.detail ?? fallback;
}

export async function mutation<T = undefined>(
  url: string,
  method: HttpMethod,
  payload?: unknown,
  contentType?: string,
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && payload instanceof FormData;

  const res = await axiosInstance.request<T>({
    url,
    method,
    data: payload,
    headers: {
      "Content-Type":
        contentType ?? (isFormData ? undefined : "application/json"),
    },
  });
  return res.data;
}
