"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkBadge02Icon } from "@hugeicons/core-free-icons";
import { BrandArc } from "@repo/ui/brand-mark";
import { IconButton } from "@repo/ui/icon-button";

const px = (value: number, scale: number) => value * scale;

function VerifiedPill({
  scale,
  style,
}: {
  scale: number;
  style: CSSProperties;
}) {
  return (
    <span
      style={{
        ...style,
        fontSize: px(8, scale),
        gap: px(4, scale),
        padding: `${px(2, scale)}px ${px(4, scale)}px`,
      }}
      className="absolute inline-flex items-center rounded-full bg-green-500 font-sans leading-normal font-medium text-white"
    >
      <HugeiconsIcon icon={CheckmarkBadge02Icon} size={px(12, scale)} />
      Verified
    </span>
  );
}

function Bar({ scale, style }: { scale: number; style: CSSProperties }) {
  return (
    <span
      style={{ ...style, height: px(6, scale) }}
      className="absolute rounded-full bg-grey-100"
    />
  );
}

function BackCard({ scale, className }: { scale: number; className: string }) {
  const tile = px(40, scale);
  return (
    <div
      style={{
        width: px(227, scale),
        height: px(68, scale),
        borderRadius: px(16, scale),
      }}
      className={`absolute overflow-hidden bg-white ${className}`}
    >
      <span
        style={{
          left: px(8, scale),
          top: px(6, scale),
          width: tile,
          height: tile,
          borderRadius: px(8, scale),
          borderWidth: scale,
          fontSize: px(16, scale),
        }}
        className="absolute flex items-center justify-center border-grey-200 bg-grey-50 font-medium text-grey-600"
      >
        KE
      </span>
      <Bar
        scale={scale}
        style={{
          left: px(63, scale),
          top: px(18, scale),
          width: px(118, scale),
        }}
      />
      <VerifiedPill
        scale={scale}
        style={{ left: px(61, scale), top: px(35, scale) }}
      />
    </div>
  );
}

function FrontCard() {
  return (
    <div className="absolute top-0 right-0 h-17 w-56.75 overflow-hidden rounded-xl bg-white shadow-small-thick">
      <Image
        src="/opportunities/banner-company-logo.png"
        alt=""
        width={32}
        height={32}
        unoptimized
        className="absolute top-1.5 left-2 size-8 rounded-full border border-grey-200 object-cover"
      />
      <Bar scale={1} style={{ left: 48, top: 15, width: 82 }} />
      <Bar scale={1} style={{ left: 48, top: 27, width: 55 }} />
      <VerifiedPill scale={1} style={{ left: 165, top: 6 }} />
    </div>
  );
}

export function OpportunityBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <section className="relative h-31.5 flex-none overflow-hidden rounded-lg bg-evergreen-700">
      <BrandArc
        arc="inner"
        className="absolute -top-9 right-10 h-39.25 w-41.25 rotate-34 text-evergreen-50 opacity-10"
      />
      <BrandArc
        arc="outer"
        className="absolute -top-3.75 -right-5 h-39.75 w-41.25 rotate-34 text-evergreen-50 opacity-10"
      />

      <div className="absolute top-[28.5px] left-xl flex flex-col gap-1 text-evergreen-50">
        <h2 className="font-brand text-2xl/9 font-medium">
          Discover financing opportunities
        </h2>
        <p className="text-body/6 opacity-80">
          Explore verified trade opportunities that match your funding
          preference.
        </p>
      </div>

      <div
        aria-hidden
        className="absolute top-6 right-17.5 hidden h-20 w-56.75 lg:block"
      >
        <BackCard scale={0.793} className="top-6.5 right-5.75 shadow-card" />
        <BackCard
          scale={0.863}
          className="top-4 right-3.75 shadow-small-thick"
        />
        <FrontCard />
      </div>

      <div className="absolute top-md right-lg">
        <IconButton
          label="Dismiss"
          variant="inverse"
          size="xs"
          onClick={() => setVisible(false)}
        >
          <HugeiconsIcon icon={Cancel01Icon} />
        </IconButton>
      </div>
    </section>
  );
}
