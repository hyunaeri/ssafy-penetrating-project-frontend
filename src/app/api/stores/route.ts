import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

/** `GET /api/stores` — 카테고리 매장 목록 (백엔드 `/api/v1/stores` 프록시). */
export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  const cursor = req.nextUrl.searchParams.get("cursor");
  const size = req.nextUrl.searchParams.get("size");
  const token = req.headers.get("authorization");

  const target = new URL(`${getBackendUrl()}/api/v1/stores`);
  if (categoryId) {
    target.searchParams.set("categoryId", categoryId);
  }
  if (cursor) {
    target.searchParams.set("cursor", cursor);
  }
  if (size) {
    target.searchParams.set("size", size);
  }

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
        { message: err.message ?? "매장 목록을 불러오지 못했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch stores:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
