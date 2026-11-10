"use client";

import { useRef, type Ref } from "react";

/** One box per digit. `value` holds a slot per box, so a gap stays a gap. */
export function OtpInput({
  value,
  onChange,
  ref,
  label = "Verification code",
}: {
  value: string[];
  onChange: (value: string[]) => void;
  /** Lands on the first box, so a caller can focus it after a reset. */
  ref?: Ref<HTMLInputElement>;
  label?: string;
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function setDigit(index: number, raw: string) {
    const char = raw.slice(-1).replace(/[^0-9]/g, "");
    const next = [...value];
    next[index] = char;
    onChange(next);
    if (char && index < value.length - 1) inputs.current[index + 1]?.focus();
  }

  function onKeyDown(index: number, event: React.KeyboardEvent) {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  return (
    <div role="group" aria-label={label} className="flex w-full items-center gap-xs">
      {value.map((digit, index) => (
        <input
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
            if (index !== 0 || !ref) return;
            if (typeof ref === "function") ref(el);
            else ref.current = el;
          }}
          aria-label={`Digit ${index + 1}`}
          value={digit}
          onChange={(event) => setDigit(index, event.target.value)}
          onKeyDown={(event) => onKeyDown(index, event)}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          className="h-10 min-w-0 flex-1 rounded-md border border-grey-300 bg-white text-center font-sans text-body-sm text-grey-900 outline-none focus:border-evergreen-500 focus:shadow-[0px_0px_1px_4px_rgba(47,138,122,0.08)]"
        />
      ))}
    </div>
  );
}
