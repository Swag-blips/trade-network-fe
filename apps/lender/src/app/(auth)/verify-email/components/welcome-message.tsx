"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readOnboardFirstName } from "@/lib/onboarding-storage";

/**
 * Shown in place of the code form once the email is verified, then hands over
 * to onboarding. Fixed rather than inline because it covers the auth chrome.
 */
export function WelcomeMessage() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(readOnboardFirstName() ?? "");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => router.push("/onboarding"), 1600);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-grey-50">
      <p className="font-brand text-h3 font-medium text-grey-900">
        Welcome onboard{name ? ` ${name}` : ""}
      </p>
    </div>
  );
}
