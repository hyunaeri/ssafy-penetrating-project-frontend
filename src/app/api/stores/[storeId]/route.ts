import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

type RouteContext = {
  params: Promise<{ storeId: string }>;
};

/** `GET /api/stores/[storeId]` — 매장 상세·메뉴 (백엔드 `/api/v1/stores/{storeId}` 프록시). */
export async function GET(req: NextRequest, context: RouteContext) {
  const { storeId } = await context.params;
  const token = req.headers.get("authorization");

  const target = `${getBackendUrl()}/api/v1/stores/${storeId}`;

  try {
    const response = await fetch(target, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = data as { message?: string };
      return NextResponse.json(
        { message: err.message ?? "매장 정보를 불러오지 못했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch store detail:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
