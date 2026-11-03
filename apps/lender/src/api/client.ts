import { AppConfig } from "@/lib";
import axios, { type InternalAxiosRequestConfig } from "axios";
import type { ApplicationResponse } from "./types";

export type HttpMethod = "post" | "put" | "patch" | "delete";

export const axiosInstance = axios.create({
  baseURL: AppConfig.apiUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const REFRESH_URL = "/access/refresh-token";

/**
 * A 401 from these means "wrong code" or "no such account", not "session
 * expired" — refreshing would be pointless, and on the refresh call itself it
 * would recurse.
 */
const UNAUTHENTICATED_PATHS = ["/access/login", "/onboard/signup", REFRESH_URL];

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
 * The access token lasts an hour and the refresh cookie twelve, so an expired
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

/** A rejected call still arrives as HTTP 200, so `status` is the real result. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly statusCode: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * The service shouts — "Email verified!!!", "Internal Server error !!". Strip
 * the trailing exclamations before any of it reaches a toast.
 */
export function serverMessage(message: string | null | undefined) {
  return message?.replace(/\s*!+$/, "").trim() || null;
}

function assertOk<T>(res: ApplicationResponse<T>): ApplicationResponse<T> {
  if (res.status !== "SUCCESSFUL") {
    throw new ApiError(
      serverMessage(res.message) ?? serverMessage(res.statusMessage) ?? "",
      res.statusCode,
    );
  }
  return res;
}

/**
 * Which backend a call goes to. They share one session: the refresh above
 * always goes to the access service, and a replayed request keeps its baseURL.
 */
export type ApiService = "access" | "lender";

const BASE_URLS: Record<ApiService, string> = {
  access: AppConfig.apiUrl,
  lender: AppConfig.lenderApiUrl,
};

interface QueryOptions {
  params?: Record<string, unknown>;
  service?: ApiService;
}

/** The whole envelope, as `mutationResponse` is for writes. */
export async function queryResponse<T>(
  url: string,
  { params, service = "access" }: QueryOptions = {},
): Promise<ApplicationResponse<T>> {
  const res = await axiosInstance.get<ApplicationResponse<T>>(url, {
    params,
    baseURL: BASE_URLS[service],
  });
  return assertOk(res.data);
}

/** `T` is the payload inside the envelope, not the envelope itself. */
export async function query<T>(
  url: string,
  options?: QueryOptions,
): Promise<T> {
  return (await queryResponse<T>(url, options)).data;
}

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApplicationResponse<unknown> | undefined;
    return serverMessage(data?.message) ?? err.message ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
}

/**
 * The whole envelope, with failures already thrown — for the few flows that
 * surface the service's own `message` rather than copy of our own.
 */
interface MutationOptions {
  contentType?: string;
  service?: ApiService;
}

export async function mutationResponse<T>(
  url: string,
  method: HttpMethod,
  payload?: unknown,
  { contentType, service = "access" }: MutationOptions = {},
): Promise<ApplicationResponse<T>> {
  type Envelope = ApplicationResponse<T>;

  const isFormData =
    typeof FormData !== "undefined" && payload instanceof FormData;

  const config = {
    baseURL: BASE_URLS[service],
    headers: {
      ...(contentType || !isFormData
        ? { "Content-Type": contentType ?? "application/json" }
        : { "Content-Type": undefined }),
    },
  };

  switch (method) {
    case "post":
      return assertOk(
        (await axiosInstance.post<Envelope>(url, payload, config)).data,
      );
    case "put":
      return assertOk(
        (await axiosInstance.put<Envelope>(url, payload, config)).data,
      );
    case "patch":
      return assertOk(
        (await axiosInstance.patch<Envelope>(url, payload, config)).data,
      );
    case "delete":
      return assertOk(
        (
          await axiosInstance.delete<Envelope>(url, {
            ...config,
            data: payload,
          })
        ).data,
      );
  }
}

/** `T` is the payload inside the envelope, not the envelope itself. */
export async function mutation<T>(
  url: string,
  method: HttpMethod,
  payload?: unknown,
  options?: MutationOptions,
): Promise<T> {
  return (await mutationResponse<T>(url, method, payload, options)).data;
}
