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
  CircleCheckIcon,
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
  success: { icon: CircleCheckIcon, className: "text-toast-success" },
  info: { icon: InformationCircleIcon, className: "text-toast-info" },
  error: { icon: Alert02Icon, className: "text-toast-error" },
};

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
          <span className="absolute top-0 left-0 h-[5px] w-full rounded-full bg-current" />
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
  const tone = state === "loading" ? null : STATE_ICON[state];

  return (
    <div
      role={state === "error" ? "alert" : "status"}
      aria-live={state === "error" ? "assertive" : "polite"}
      className="flex items-center justify-center gap-md overflow-hidden rounded-md bg-grey-900 p-2.5 shadow-elevated"
    >
      <div
        className={`flex flex-none items-center ${state === "loading" ? "gap-2.5" : "gap-xs"}`}
      >
        {tone ? (
          <HugeiconsIcon
            icon={tone.icon}
            size={20}
            className={`flex-none ${tone.className}`}
          />
        ) : (
          <Spinner />
        )}
        <p className="font-sans text-body-sm/[normal] font-medium whitespace-nowrap text-white">
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
            className="flex-none text-white hover:text-grey-300"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
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
      <div className="pointer-events-none fixed inset-x-0 top-xl z-50 flex flex-col items-center gap-xs px-md">
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
