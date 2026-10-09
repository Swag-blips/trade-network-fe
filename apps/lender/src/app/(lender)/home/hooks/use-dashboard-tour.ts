"use client";

import { useEffect, useRef, useState } from "react";

export type TourPlacement = "right" | "left" | "above";

const GAP = 16;
const RING_INSET = 8;
const TAIL_HEIGHT = 30;

const STEPS = [
  {
    target: "#agent-fab",
    title: "Meet Tai",
    description:
      "Hi, I’m Tai 👋, your AI assistant. I’m here to help you find new opportunities, evaluate funding requests, manage your portfolio, and keep you updated on what matters most.",
  },
  {
    target: "#dashboard-overview",
    title: "Overview",
    description:
      "See your available capital, outstanding exposure, and how your capital is currently deployed.",
  },
  {
    target: "#new-for-you",
    title: "Latest updates",
    description:
      "Know what needs your attention\nSee important actions, changes, and upcoming items so you know what to handle next.",
  },
  {
    target: 'a[href="/portfolio"]',
    title: "Portfolio",
    description:
      "Track the businesses you’ve funded, monitor exposure and performance, and drill into individual trades for more detail.",
  },
  {
    target: 'a[href="/inbox"]',
    title: "Inbox",
    description:
      "View messages and information requests from businesses and counterparties you’re working with.",
  },
  {
    target: "#sidebar-opportunities",
    title: "Opportunities & Offers",
    description:
      "Discover funding opportunities that match your mandate, review the details, and manage the offers you’ve submitted",
  },
];

export function useDashboardTour(onClose: () => void) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [placement, setPlacement] = useState<TourPlacement>("right");
  const [tailOffset, setTailOffset] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const current = STEPS[step]!;

  useEffect(() => {
    const dialog = dialogRef.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  useEffect(() => {
    const target = current.target
      ? document.querySelector(current.target)
      : null;
    target?.scrollIntoView({ block: "nearest", inline: "nearest" });

    function positionCard() {
      const rect = target?.getBoundingClientRect() ?? null;
      setTargetRect(rect);
      const card = cardRef.current;
      if (!card) return;

      const cardW = card.offsetWidth;
      const cardH = card.offsetHeight;
      const maxLeft = window.innerWidth - cardW - GAP;
      const maxTop = window.innerHeight - cardH - GAP;

      if (!rect) {
        card.style.left = `${maxLeft}px`;
        card.style.top = `${maxTop}px`;
        setPlacement("above");
        return;
      }

      const ringLeft = rect.left - RING_INSET;
      const ringRight = rect.right + RING_INSET;

      let next: TourPlacement;
      let left: number;
      if (ringRight + GAP + cardW <= window.innerWidth - GAP) {
        next = "right";
        left = ringRight + GAP;
      } else if (ringLeft - GAP - cardW >= GAP) {
        next = "left";
        left = ringLeft - GAP - cardW;
      } else {
        next = "above";
        left = Math.max(GAP, Math.min(rect.right - cardW, maxLeft));
      }

      const top =
        next === "above"
          ? Math.max(GAP, rect.top - RING_INSET - GAP - cardH)
          : Math.max(GAP, Math.min(rect.top, maxTop));

      card.style.left = `${Math.max(GAP, Math.min(left, maxLeft))}px`;
      card.style.top = `${top}px`;
      setPlacement(next);

      const targetCentre = rect.top + rect.height / 2;
      setTailOffset(
        Math.max(
          12,
          Math.min(
            targetCentre - top - TAIL_HEIGHT / 2,
            cardH - TAIL_HEIGHT - 12,
          ),
        ),
      );
    }

    positionCard();
    window.addEventListener("resize", positionCard);
    window.addEventListener("scroll", positionCard, true);
    const observer = new ResizeObserver(positionCard);
    if (target) observer.observe(target);
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      window.removeEventListener("resize", positionCard);
      window.removeEventListener("scroll", positionCard, true);
      observer.disconnect();
    };
  }, [current]);

  function goBack() {
    setStep(Math.max(0, step - 1));
  }

  function goNext() {
    if (step === STEPS.length - 1) {
      onClose();
    } else {
      setStep(step + 1);
    }
  }

  return {
    step,
    current,
    totalSteps: STEPS.length,
    isLastStep: step === STEPS.length - 1,
    targetRect,
    placement,
    tailOffset,
    ringInset: RING_INSET,
    dialogRef,
    cardRef,
    goBack,
    goNext,
  };
}
