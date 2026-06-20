import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";
import { getBearerToken, unauthorizedResponse } from "@/shared/api/proxy-auth";

type RouteContext = {
  params: Promise<{ storeId: string }>;
};

/** `GET /api/owner/stores/[storeId]/menus` — 점주 메뉴 목록 프록시. */
export async function GET(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const { storeId } = await context.params;

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/owner/stores/${storeId}/menus`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy owner menus list:", error);
    return NextResponse.json(
      { message: "메뉴 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/** `POST /api/owner/stores/[storeId]/menus` — 메뉴 생성 (multipart 프록시). */
export async function POST(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const { storeId } = await context.params;

  try {
    const formData = await req.formData();
    const response = await fetch(
      `${getBackendUrl()}/api/v1/owner/stores/${storeId}/menus`,
      {
        method: "POST",
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
        body: formData,
      }
    );

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy owner menu create:", error);
    return NextResponse.json(
      { message: "메뉴 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
