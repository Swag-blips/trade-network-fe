"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { IconButton } from "@repo/ui/icon-button";

const UPDATED = "September 10, 2026";

const SECTIONS: {
  title: string;
  must: string[];
  mustNot?: string[];
}[] = [
  {
    title: "1. Identity & accounts",
    must: [
      "Provide accurate legal name, registration details, and beneficial ownership information as requested in KYB",
      "Keep Partner Profile contacts and authorised users current; revoke access when staff leave",
      "Accept the current EPA version before production use",
    ],
    mustNot: [
      "Share login credentials or API keys across unaffiliated entities",
      "Create duplicate organisations to evade suspension or limits",
    ],
  },
  {
    title: "2. Lawful use",
    must: [
      "Comply with applicable law in jurisdictions where you operate (including sanctions and anti-money-laundering requirements)",
      "Fund only opportunities verified through the TradeNetwork ecosystem",
    ],
  },
];

/* Exact legal copy pending — Figma MCP hit its rate limit before the full
   scroll of this node could be fetched. Structure and opening section match
   the comp; later sections are a reasonable placeholder to keep the flow
   functional. */
export function GuidelinesModal({
  onClose,
  onAgree,
}: {
  onClose: () => void;
  onAgree: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [consent, setConsent] = useState(true);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="guidelines-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto h-[calc(100vh-4rem)] w-[600px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-white p-0 backdrop:bg-grey-900/40"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center gap-md border-b border-grey-100 px-lg py-md">
          <label className="flex min-w-0 flex-1 items-center gap-xs">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="peer sr-only"
            />
            <span
              className={`flex size-5 flex-none items-center justify-center rounded-[4px] border text-white transition-colors ${
                consent
                  ? "border-evergreen-600 bg-evergreen-600"
                  : "border-grey-400 bg-white"
              }`}
            >
              {consent ? (
                <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={3} />
              ) : null}
            </span>
            <span className="min-w-0 truncate text-body-sm text-grey-900">
              I consent to TradeNetwork&rsquo;s Capital Provider&rsquo;s
              Guidelines
            </span>
          </label>
          <Button
            variant="primary"
            size="sm"
            disabled={!consent}
            onClick={onAgree}
          >
            I agree
          </Button>
          <IconButton label="Close" size="xs" onClick={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} />
          </IconButton>
        </header>

        <div className="flex min-h-px flex-1 flex-col gap-lg overflow-y-auto px-lg py-xl sm:px-2xl">
          <div className="flex flex-col items-center gap-xs text-center">
            <h2 className="font-sans text-h4 font-medium text-grey-900">
              Network Operating Guidelines For Capital Providers
            </h2>
            <p className="text-body-sm text-grey-500">Updated: {UPDATED}</p>
          </div>
          <hr className="border-grey-100" />

          {SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-sm">
              <h3 className="font-sans text-body-lg font-medium text-grey-900">
                {section.title}
              </h3>

              <div className="flex flex-col gap-xs">
                <p className="text-body-sm font-medium text-evergreen-600">
                  You must
                </p>
                <ul className="flex flex-col gap-xs pl-lg text-body-sm text-grey-800">
                  {section.must.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {section.mustNot ? (
                <div className="flex flex-col gap-xs">
                  <p className="text-body-sm font-medium text-red-error-500">
                    You must not
                  </p>
                  <ul className="flex flex-col gap-xs pl-lg text-body-sm text-grey-800">
                    {section.mustNot.map((item) => (
                      <li key={item} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </dialog>
  );
}
