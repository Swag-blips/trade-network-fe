"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@repo/ui/button-link";

export function AuthHeaderCta() {
  const isLoginFlow = usePathname().startsWith("/login");

  return (
    <ButtonLink
      href={isLoginFlow ? "/create-account" : "/login"}
      variant="tertiary"
      size="compact"
    >
      {isLoginFlow ? "Create a new account" : "Login"}
    </ButtonLink>
  );
}
