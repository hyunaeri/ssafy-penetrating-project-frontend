import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

/** `GET /api/favorites` — 찜 매장 목록 (백엔드 `/api/v1/favorites` 프록시). */
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(`${getBackendUrl()}/api/v1/favorites`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = data as { message?: string };
      return NextResponse.json(
        { message: err.message ?? "찜 목록을 불러오지 못했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch favorite stores:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
