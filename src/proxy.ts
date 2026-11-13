import { NextRequest, NextResponse } from "next/server";
export function proxy(request: NextRequest) {
  const explicit = request.nextUrl.searchParams.get("lang");
  const locale =
    explicit === "en" || explicit === "tr"
      ? explicit
      : request.cookies.get("sunka_locale")?.value === "tr"
        ? "tr"
        : "en";
  const headers = new Headers(request.headers);
  headers.set("x-sunka-locale", locale);
  const response = NextResponse.next({ request: { headers } });
  if (explicit === "en" || explicit === "tr")
    response.cookies.set("sunka_locale", locale, {
      path: "/",
      sameSite: "lax",
      maxAge: 31536000,
      secure: process.env.COOKIE_SECURE === "true",
    });
  return response;
}
export const config = { matcher: ["/((?!api|_next|images|favicon.ico).*)"] };
