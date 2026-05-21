import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
]);

function filterHeaders(source: Headers): Headers {
  const headers = new Headers();
  source.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  return headers;
}

/** `GET /api/login/oauth/google` — 로그인용 (백엔드 `/oauth2/authorization/google` 프록시). */
export async function GET(request: NextRequest) {
  const targetUrl = `${getBackendUrl()}/oauth2/authorization/google${request.nextUrl.search}`;
  const headers = filterHeaders(request.headers);

  const backendResponse = await fetch(targetUrl, {
    method: "GET",
    headers,
    redirect: "manual",
  });

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: filterHeaders(backendResponse.headers),
  });
}
