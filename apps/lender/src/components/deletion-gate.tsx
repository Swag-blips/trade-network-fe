"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMe } from "@/hooks/use-me";

/** The pages that need no organisation, so they stay open while deletion is scheduled. */
export const OPEN_WHILE_DELETING = [
  "/settings/profile",
  "/settings/account-security",
  "/settings/login-activity",
];

export function DeletionGate({ children }: { children: ReactNode }) {
  const { data: me } = useMe();
  const pathname = usePathname();
  const router = useRouter();
  const blocked = !!me?.deleteAfter && !OPEN_WHILE_DELETING.includes(pathname);

  useEffect(() => {
    if (blocked) router.replace("/settings/account-security");
  }, [blocked, router]);

  return blocked ? null : children;
}
