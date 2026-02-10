import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("next-auth.session-token");

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/todos/:path*"],
};
