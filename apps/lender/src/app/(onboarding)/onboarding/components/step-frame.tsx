"use client";

import type { FormEvent, ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { IconButton } from "@repo/ui/icon-button";

export function StepFrame({
  title,
  submitLabel,
  canSubmit,
  loading = false,
  onBack,
  onSubmit,
  raisedFooter = false,
  children,
}: {
  title: string;
  submitLabel: string;
  canSubmit: boolean;
  loading?: boolean;
  onBack?: () => void;
  onSubmit: () => void;
  raisedFooter?: boolean;
  children: ReactNode;
}) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (canSubmit && !loading) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-px flex-1 flex-col">
      <div className="min-h-px flex-1 overflow-y-auto px-4 pt-9 pb-10 sm:px-16">
        <div className="flex max-w-150 flex-col gap-xl">
          {/* 32px is off the type scale, and an h1 inherits display tracking. */}
          <h1 className="font-brand text-[32px]/[1.24] font-medium tracking-normal text-grey-900">
            {title}
          </h1>
          {children}
        </div>
      </div>

      <footer
        className={`relative flex flex-none items-center justify-between border-t border-grey-200 bg-white px-lg py-md ${
          raisedFooter ? "shadow-container-modal" : ""
        }`}
      >
        {onBack ? (
          <IconButton
            label="Back"
            variant="tertiary"
            size="lg"
            disabled={loading}
            onClick={onBack}
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} />
          </IconButton>
        ) : (
          <span />
        )}
        <Button
          type="submit"
          size="auth"
          loading={loading}
          disabled={!canSubmit || loading}
        >
          {submitLabel}
        </Button>
      </footer>
    </form>
  );
}
