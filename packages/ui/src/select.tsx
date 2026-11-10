"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

/** `size` is a real form-control attribute (a number), so the prop is `variant`. */
export type SelectVariant =
  "field" | "auth" | "strong" | "chip" | "filter" | "soft";

export interface SelectOption {
  value: string;
  /** Shown in the list. */
  label: string;
  /** Shown in the closed control; defaults to `label`. */
  display?: string;
}

const VARIANTS: Record<SelectVariant, { root: string; field: string }> = {
  field: {
    root: "h-10 w-full border-grey-300 bg-white",
    field: "px-sm pr-9 text-body-sm/[normal] text-grey-900",
  },
  auth: {
    root: "h-10 w-full border-grey-200 bg-white",
    field: "px-sm pr-9 text-body/[normal] text-grey-900",
  },
  strong: {
    root: "h-10 w-full border-grey-300 bg-white",
    field: "px-sm pr-9 text-body/[normal] text-grey-800",
  },
  chip: {
    root: "h-7.25 border-grey-200 bg-white shadow-small-thick",
    field: "px-xs pr-7 text-body-sm font-medium text-grey-800",
  },
  filter: {
    root: "h-8 border-transparent bg-grey-100",
    field: "px-xs pr-7 text-body-sm/[1.5] font-medium text-grey-800",
  },
  soft: {
    root: "h-8.5 border-grey-100 bg-grey-100",
    field: "px-xs pr-8 text-body/[1.5] font-medium text-grey-800",
  },
};

function normalise(options: (SelectOption | string)[]): SelectOption[] {
  return options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
}

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: (SelectOption | string)[];
  variant?: SelectVariant;
  leading?: ReactNode;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  /** Which edge of the control the popup lines up with; `end` for controls at the right edge of the page. */
  align?: "start" | "end";
  "aria-label"?: string;
}

export function Select({
  value,
  onValueChange,
  options,
  variant = "field",
  leading,
  placeholder,
  id,
  className = "",
  disabled = false,
  align = "start",
  "aria-label": ariaLabel,
}: SelectProps) {
  const styles = VARIANTS[variant];
  const items = normalise(options);
  const listId = useId();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ term: "", at: 0 });

  const selected = items.findIndex((item) => item.value === value);
  const chosen = selected >= 0 ? items[selected]! : null;
  const label = chosen ? (chosen.display ?? chosen.label) : (placeholder ?? "");

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.scrollIntoView({ block: "nearest" });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function show(index: number) {
    setActive(Math.max(0, Math.min(index, items.length - 1)));
    setOpen(true);
  }

  function choose(index: number) {
    const item = items[index];
    if (!item) return;
    onValueChange(item.value);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        show(open ? active + 1 : Math.max(selected, 0));
        return;
      case "ArrowUp":
        event.preventDefault();
        show(open ? active - 1 : Math.max(selected, 0));
        return;
      case "Home":
        if (!open) return;
        event.preventDefault();
        show(0);
        return;
      case "End":
        if (!open) return;
        event.preventDefault();
        show(items.length - 1);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(active);
        else show(Math.max(selected, 0));
        return;
      case "Escape":
        if (!open) return;
        event.preventDefault();
        setOpen(false);
        return;
      case "Tab":
        setOpen(false);
        return;
      default:
        break;
    }

    if (event.key.length !== 1 || event.metaKey || event.ctrlKey) return;
    const now = Date.now();
    typed.current = {
      term:
        (now - typed.current.at < 600 ? typed.current.term : "") + event.key,
      at: now,
    };
    const match = items.findIndex((item) =>
      item.label.toLowerCase().startsWith(typed.current.term.toLowerCase()),
    );
    if (match < 0) return;
    if (open) setActive(match);
    else onValueChange(items[match]!.value);
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : show(Math.max(selected, 0)))}
        onKeyDown={onKeyDown}
        className={`relative flex cursor-pointer items-center gap-2.5 rounded-md border text-left font-sans outline-none focus-visible:border-evergreen-600 disabled:cursor-not-allowed disabled:text-grey-500 ${styles.root} ${styles.field}`}
      >
        {leading ? <span className="flex-none">{leading}</span> : null}
        <span
          className={`min-w-0 flex-1 truncate ${selected >= 0 ? "" : "text-grey-500"}`}
        >
          {label}
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={16}
          className={`pointer-events-none absolute text-grey-900 ${variant === "chip" || variant === "soft" ? "right-xs" : "right-sm"}`}
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute top-[calc(100%+4px)] ${align === "end" ? "right-0" : "left-0"} z-50 flex max-h-70 w-max min-w-full flex-col gap-1 overflow-y-auto rounded-lg border border-grey-200 bg-white p-xs shadow-thick`}
        >
          {items.map((item, index) => (
            <li
              key={item.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === selected}
              onPointerEnter={() => setActive(index)}
              onClick={() => choose(index)}
              className={`cursor-pointer rounded-md px-xs py-1 text-body text-grey-800 ${
                index === active ? "bg-grey-100" : "bg-white"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
