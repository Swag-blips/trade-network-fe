"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@repo/ui/button-link";

export function AuthHeaderCta() {
  const pathname = usePathname();
  const isLoginFlow = pathname.startsWith("/login");

  if (pathname.startsWith("/join")) return null;

  return (
    <ButtonLink
      href={isLoginFlow ? "/create-account" : "/login"}
      variant="tertiary"
      size="compact"
    >
      {isLoginFlow ? "Create account" : "Login"}
    </ButtonLink>
  );
}
