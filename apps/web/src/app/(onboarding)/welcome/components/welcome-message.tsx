"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function WelcomeMessage() {
  const router = useRouter();
  const params = useSearchParams();
  const name = params.get("name") ?? "there";
  const role = params.get("role") ?? "capital-provider";

  useEffect(() => {
    const timer = setTimeout(() => router.push(`/organisation?role=${role}`), 1600);
    return () => clearTimeout(timer);
  }, [router, role]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-grey-50">
      <p className="font-brand text-h3 font-medium text-grey-900">
        Welcome onboard {name}
      </p>
    </div>
  );
}
