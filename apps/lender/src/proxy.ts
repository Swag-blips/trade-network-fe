import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const cookie = request.cookies.get("tn_access_token");

}
