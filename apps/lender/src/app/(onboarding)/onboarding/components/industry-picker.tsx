"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type Ref,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

export function IndustryPicker({
  id,
  inputRef,
  options,
  selected,
  onChange,
}: {
  id: string;
  inputRef?: Ref<HTMLInputElement>;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const term = query.trim().toLowerCase();
  const matches = options.filter((option) =>
    option.toLowerCase().includes(term),
  );

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // The picker is the last thing in the step, so the list opens below the fold.
  useEffect(() => {
    if (open) listRef.current?.scrollIntoView({ block: "nearest" });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function toggle(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
  }

  function move(index: number) {
    setActive(Math.max(0, Math.min(index, matches.length - 1)));
    setOpen(true);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(open ? active + 1 : active);
        return;
      case "ArrowUp":
        event.preventDefault();
        move(open ? active - 1 : active);
        return;
      case "Enter": {
        // Always swallowed: Enter here must never submit the step.
        event.preventDefault();
        const option = matches[active];
        if (open && option) toggle(option);
        else setOpen(true);
        return;
      }
      case "Escape":
        if (!open) return;
        event.preventDefault();
        setOpen(false);
        return;
      case "Tab":
        setOpen(false);
        return;
      default:
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="flex h-10 w-full items-center overflow-hidden rounded-md border border-grey-200 bg-white font-sans text-body/[normal] text-grey-900 focus-within:border-evergreen-600">
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={
            open && matches[active] ? `${listId}-${active}` : undefined
          }
          autoComplete="off"
          placeholder="Search or select industries"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onClick={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent py-2.5 pr-9 pl-sm outline-none placeholder:text-grey-500"
        />
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={16}
          className="pointer-events-none absolute top-3 right-sm text-grey-900"
        />
      </div>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          aria-label="Industries"
          className="absolute top-[calc(100%+4px)] left-0 z-50 flex max-h-70 w-full flex-col gap-1 overflow-y-auto rounded-lg border border-grey-200 bg-white p-xs shadow-thick"
        >
          {matches.map((option, index) => (
            <li
              key={option}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={selected.includes(option)}
              onPointerEnter={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => toggle(option)}
              className={`flex cursor-pointer items-center justify-between gap-xs rounded-md px-xs py-1 text-body text-grey-800 ${
                index === active ? "bg-grey-100" : "bg-white"
              }`}
            >
              {option}
              {selected.includes(option) ? (
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={16}
                  className="flex-none text-evergreen-600"
                />
              ) : null}
            </li>
          ))}
          {matches.length === 0 ? (
            <li className="px-xs py-1 text-body text-grey-500">
              No matching industries
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
