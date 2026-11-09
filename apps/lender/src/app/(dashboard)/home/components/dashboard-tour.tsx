"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { TaiAgent } from "@repo/ui/tai-agent";
import { useDashboardTour } from "../hooks/use-dashboard-tour";

const TAIL_CLIP = {
  left: "polygon(100% 0, 0 50%, 100% 100%)",
  right: "polygon(0 0, 100% 50%, 0 100%)",
};

export function DashboardTour({ onClose }: { onClose: () => void }) {
  const {
    step,
    current,
    totalSteps,
    isLastStep,
    targetRect,
    placement,
    tailOffset,
    ringInset,
    dialogRef,
    cardRef,
    goBack,
    goNext,
  } = useDashboardTour(onClose);

  const tailSide = placement === "right" ? "left" : "right";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="tour-title"
      aria-describedby="tour-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-0 backdrop:bg-transparent"
    >
      {targetRect ? (
        <div
          aria-hidden="true"
          className="fixed rounded-md border-2 border-evergreen-600 shadow-tour-spotlight"
          style={{
            left: targetRect.left - ringInset,
            top: targetRect.top - ringInset,
            width: targetRect.width + ringInset * 2,
            height: targetRect.height + ringInset * 2,
          }}
        />
      ) : (
        <div aria-hidden="true" className="fixed inset-0 bg-black/40" />
      )}

      <div
        ref={cardRef}
        className="fixed w-tour-card max-w-[calc(100vw-2rem)] rounded-md bg-white text-grey-900"
      >
        {placement !== "above" && (
          <span
            aria-hidden="true"
            className="absolute h-7.5 w-4 bg-white"
            style={{
              [tailSide]: -16,
              top: tailOffset,
              clipPath: TAIL_CLIP[tailSide],
            }}
          />
        )}
        <div
          className="flex flex-col gap-xs p-md"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="mb-xs flex items-center justify-between">
            <TaiAgent size="sm" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close tour"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={20} />
            </Button>
          </div>
          <h2
            id="tour-title"
            className="font-sans text-body font-medium text-grey-800"
          >
            {current.title}
          </h2>
          <p id="tour-description" className="text-body-sm whitespace-pre-line">
            {current.description}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-grey-100 px-md py-sm">
          <span className="font-brand text-caption text-grey-500">
            {step + 1} of {totalSteps}
          </span>
          <div className="flex items-center gap-xs">
            <Button
              variant="ghost"
              size="sm"
              disabled={step === 0}
              onClick={goBack}
              leadingIcon={<HugeiconsIcon icon={ArrowLeft01Icon} size={16} />}
            >
              {isLastStep ? "Previous" : "Back"}
            </Button>
            <span aria-hidden="true" className="h-xs w-px bg-grey-100" />
            <Button
              variant="ghost"
              size="sm"
              onClick={goNext}
              trailingIcon={
                isLastStep ? undefined : (
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                )
              }
            >
              {isLastStep ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
