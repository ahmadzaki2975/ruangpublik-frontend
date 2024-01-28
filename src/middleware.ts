import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authPage = ["/login", "/signup"];
  const cookies = request.cookies;

  if (authPage.includes(request.nextUrl.pathname)) {
    if (cookies) {
      return NextResponse.redirect(`${request.nextUrl.origin}/forum`);
    }
  }

  return;
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/login",
    "/signup",
    "/profile",
    "/thread/:id",
    "/forum",
    "/tersimpan",
    "/terbaru",
  ],
};
