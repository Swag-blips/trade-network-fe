"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  Cancel01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";

export type ToastState = "success" | "info" | "error" | "loading";

export interface ToastOptions {
  message: string;
  state?: ToastState;
  action?: { label: string; onClick: () => void };
  /** ms before auto-dismiss; loading toasts never auto-dismiss. */
  duration?: number;
}

interface ToastRecord extends ToastOptions {
  id: number;
}

const STATE_ICON = {
  info: { icon: InformationCircleIcon, className: "text-toast-info" },
  error: { icon: Alert02Icon, className: "text-toast-error" },
};

function SuccessIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="size-5 flex-none"
    >
      <path
        d="M9.9974 18.3332C14.5997 18.3332 18.3307 14.6022 18.3307 9.99984C18.3307 5.39746 14.5997 1.6665 9.9974 1.6665C5.39502 1.6665 1.66406 5.39746 1.66406 9.99984C1.66406 14.6022 5.39502 18.3332 9.9974 18.3332Z"
        className="fill-toast-success"
      />
      <path
        d="M6.66406 10.4165L8.33073 12.0832L12.9141 7.9165"
        stroke="white"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SPINNER_BARS = Array.from({ length: 8 }, (_, i) => i);

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="animate-spinner-chase relative size-5 flex-none motion-reduce:animate-none"
    >
      {SPINNER_BARS.map((index) => (
        <span
          key={index}
          className={`absolute top-0 left-1/2 h-full w-[1.667px] origin-center ${
            index === 0 ? "text-evergreen-400" : "text-grey-700"
          }`}
          style={{ transform: `rotate(${index * 45}deg)` }}
        >
          <span className="absolute top-0 left-0 h-1.25 w-full rounded-full bg-current" />
        </span>
      ))}
    </span>
  );
}

export function Toast({
  message,
  state = "success",
  action,
  onDismiss,
}: ToastOptions & { onDismiss?: () => void }) {
  return (
    <div
      role={state === "error" ? "alert" : "status"}
      aria-live={state === "error" ? "assertive" : "polite"}
      className="flex min-h-10 w-full items-center justify-center gap-md overflow-hidden rounded-md bg-grey-800 px-sm py-xs shadow-elevated"
    >
      <div
        className={`flex min-w-0 flex-1 items-center ${state === "loading" ? "gap-2.5" : "gap-xs"}`}
      >
        {state === "success" ? <SuccessIcon /> : null}
        {state === "loading" ? <Spinner /> : null}
        {state === "info" || state === "error" ? (
          <HugeiconsIcon
            icon={STATE_ICON[state].icon}
            size={20}
            className={`flex-none ${STATE_ICON[state].className}`}
          />
        ) : null}
        <p className="min-w-0 flex-1 font-sans text-body/[normal] font-medium text-grey-50">
          {message}
        </p>
      </div>
      <div className="flex flex-none items-center gap-2.5">
        {action ? (
          <button
            type="button"
            onClick={action.onClick}
            className="rounded-full px-1.5 py-1 font-sans text-body-sm/[normal] font-medium whitespace-nowrap text-evergreen-400 hover:bg-grey-800"
          >
            {action.label}
          </button>
        ) : null}
        {onDismiss ? (
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onDismiss}
            className="flex-none cursor-pointer text-grey-500 hover:text-grey-300"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.25} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

const ToastContext = createContext<{
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(0);

  function dismiss(id: number) {
    setToasts((current) => current.filter((item) => item.id !== id));
  }

  function toast(options: ToastOptions) {
    const id = (nextId.current += 1);
    setToasts((current) => [...current, { ...options, id }]);
    if (options.state !== "loading") {
      setTimeout(() => dismiss(id), options.duration ?? 5000);
    }
    return id;
  }

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed top-5 right-5 z-50 flex w-82 max-w-[calc(100vw-2.5rem)] flex-col gap-xs">
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <Toast {...item} onDismiss={() => dismiss(item.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return context;
}
