import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The refresh cookie, not the access one: the access token lasts 15 minutes, and
// an expired one is renewed by the API client, not here.
const SESSION_COOKIE = "tn_refresh_token";

export function proxy(request: NextRequest) {
  const signedIn = request.cookies.has(SESSION_COOKIE);

  // Onboarding runs before a session exists, so a session means it's done.
  if (request.nextUrl.pathname === "/onboarding") {
    return signedIn
      ? NextResponse.redirect(new URL("/home", request.url))
      : NextResponse.next();
  }

  if (signedIn) return NextResponse.next();

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/onboarding",
    "/home/:path*",
    "/opportunities/:path*",
    "/portfolio/:path*",
    "/settings/:path*",
  ],
};
