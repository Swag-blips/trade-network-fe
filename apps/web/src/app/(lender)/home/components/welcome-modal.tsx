"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { NextIcon, Rocket01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@repo/ui/button";
import { BrandArc, BrandMark } from "@/components/brand-mark";

export interface WelcomeModalProps {
  open: boolean;
  onStartTour: () => void;
  onSkip: () => void;
}

export function WelcomeModal({ open, onStartTour, onSkip }: WelcomeModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        onSkip();
      }}
      aria-labelledby="welcome-modal-title"
      className="m-auto w-full max-w-196.75 overflow-hidden rounded-xl bg-white p-0 backdrop:bg-grey-900/40"
    >
      <div className="flex">
        <div className="relative hidden h-119.75 w-77.25 flex-none overflow-hidden bg-evergreen-600 md:block">
          <BrandArc
            arc="outer"
            className="absolute left-[39.6px] top-23.25 h-[244.2px] w-[253.5px] text-evergreen-300 opacity-10"
          />
          <BrandArc
            arc="inner"
            className="absolute -left-14.25 top-[118.2px] h-[240.6px] w-[253.5px] text-evergreen-300 opacity-10"
          />

          <div className="absolute left-[calc(50%+18.55px)] top-[calc(50%+61.15px)] flex h-[638.283px] w-[440.693px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <div className="-scale-y-100 rotate-[-177.49deg]">
              <Image
                src="/brand/welcome-photo.webp"
                alt=""
                width={414}
                height={621}
                className="h-[620.731px] w-[413.871px] max-w-none object-cover"
                unoptimized
                priority
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-34.75 w-86.5 bg-linear-to-b from-evergreen-600/0 to-evergreen-600" />

          <BrandMark className="absolute left-[24.2px] top-6 h-6 w-[31.61px] text-evergreen-50" />
        </div>

        <div className="flex flex-1 flex-col justify-center px-10 py-12 md:h-[479px] md:py-0">
          <div className="flex flex-col gap-xl">
            <div className="flex flex-col gap-md">
              <h2
                id="welcome-modal-title"
                className="font-brand text-[2rem]/[1.25] font-medium text-grey-900"
              >
                Welcome to TradeNetwork for{" "}
                <span className="text-evergreen-600">Capital Providers</span>
              </h2>
              <p className="text-body text-grey-800">
                Take a quick tour to see how to discover financing
                opportunities, manage your offers, and monitor your funded
                portfolio.
              </p>
            </div>

            <div className="flex items-center gap-md">
              <Button
                size="lg"
                onClick={onStartTour}
                leadingIcon={<HugeiconsIcon icon={Rocket01Icon} />}
              >
                Start tour
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={onSkip}
                trailingIcon={<HugeiconsIcon icon={NextIcon} />}
              >
                Skip tour
              </Button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
