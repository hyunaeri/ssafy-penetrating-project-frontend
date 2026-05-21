import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

/** `GET /api/main/me` — 메인 페이지용 현재 사용자 (백엔드 `/api/v1/auth/me` 프록시). */
export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(`${getBackendUrl()}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      return NextResponse.json(
        { message: err.message ?? "사용자 정보를 불러오지 못했습니다." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
