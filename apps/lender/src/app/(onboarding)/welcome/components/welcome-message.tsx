"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function WelcomeMessage({ name, role }: { name: string; role: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(
      () => router.push(`/organisation?role=${role}`),
      1600,
    );
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
