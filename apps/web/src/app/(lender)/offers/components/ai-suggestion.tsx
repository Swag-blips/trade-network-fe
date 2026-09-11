"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { TaiAgent } from "@/components/tai-agent";
import type { TimelineEntry } from "../types/offer";

function Emphasised({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index} className="font-medium">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function AiSuggestion({
  recommendation,
  open,
  onToggle,
  executing = false,
  onExecute,
  onEdit,
}: {
  recommendation: NonNullable<TimelineEntry["recommendation"]>;
  open: boolean;
  onToggle: () => void;
  executing?: boolean;
  onExecute?: () => void;
  onEdit?: () => void;
}) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#92bbfd] bg-white p-xs">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-xs"
      >
        {open ? null : <TaiAgent size="xs" />}
        <span className="min-w-0 flex-1 text-left font-sans text-body-sm/[normal] font-medium text-grey-800">
          {open ? "Recommendation" : "View recommendation"}
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={20}
          className={`flex-none text-grey-800 transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="mt-sm border-t border-grey-200 pt-sm">
          <div className="flex flex-col overflow-hidden rounded-md border border-grey-100 bg-grey-50 p-xs">
            <div className="flex flex-col gap-xs">
              <div className="flex items-center justify-between">
                <TaiAgent size="xs" />
                {executing ? (
                  <span className="flex items-center justify-center gap-2.5 rounded-full bg-grey-100 px-xs py-0.5 text-caption/[normal] text-grey-600">
                    <span
                      aria-hidden
                      className="size-3 animate-spin rounded-full border-2 border-grey-300 border-t-grey-500 motion-reduce:animate-none"
                    />
                    Executing
                  </span>
                ) : null}
              </div>
              <p className="text-body-sm text-grey-800">
                <Emphasised text={recommendation.text} />
              </p>
            </div>

            {executing ? null : (
              <div className="mt-sm flex items-center justify-end gap-xs border-t border-grey-200 px-xs pt-xs pb-1">
                <Button variant="ghost" size="sm" onClick={onExecute}>
                  Execute offer
                </Button>
                <span aria-hidden className="h-[19px] w-px bg-grey-200" />
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  Edit offer
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
