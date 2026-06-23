import type { NextRequest, NextResponse } from "next/server";

export function getRequestCookieHeader(
  req: NextRequest
): Record<string, string> {
  const cookie = req.headers.get("cookie");
  return cookie ? { Cookie: cookie } : {};
}

export function forwardSetCookieHeaders(
  source: Response,
  target: NextResponse
): void {
  const headers = source.headers as Headers & {
    getSetCookie?: () => string[];
  };

  const cookies =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : null;

  if (cookies?.length) {
    for (const value of cookies) {
      target.headers.append("Set-Cookie", value);
    }
    return;
  }

  const setCookie = source.headers.get("set-cookie");
  if (setCookie) {
    target.headers.append("Set-Cookie", setCookie);
  }
}
