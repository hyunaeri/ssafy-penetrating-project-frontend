import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

/** `POST /api/admin/auth/login` — 관리자 ID/PW 로그인 (OAuth와 분리). */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(`${getBackendUrl()}/api/v1/admin/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy admin login:", error);
    return NextResponse.json(
      { message: "관리자 로그인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
