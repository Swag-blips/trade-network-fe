import { AppConfig } from "@/lib";
import axios from "axios";
import type { ApplicationResponse } from "./types";

export type HttpMethod = "post" | "put" | "patch" | "delete";

export const axiosInstance = axios.create({
  baseURL: AppConfig.apiUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
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

/** `T` is the payload inside the envelope, not the envelope itself. */
export async function query<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const res = await axiosInstance.get<ApplicationResponse<T>>(url, { params });
  return assertOk(res.data).data;
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
export async function mutationResponse<T>(
  url: string,
  method: HttpMethod,
  payload?: unknown,
  contentType?: string,
): Promise<ApplicationResponse<T>> {
  type Envelope = ApplicationResponse<T>;

  const isFormData =
    typeof FormData !== "undefined" && payload instanceof FormData;

  const config = {
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
  contentType?: string,
): Promise<T> {
  return (await mutationResponse<T>(url, method, payload, contentType)).data;
}
