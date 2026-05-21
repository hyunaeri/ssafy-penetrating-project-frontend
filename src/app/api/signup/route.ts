import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

/** `POST /api/signup` — 회원가입 페이지용 (백엔드 `/api/v1/auth/signup` 프록시). */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookie = req.headers.get("cookie");

    const response = await fetch(`${getBackendUrl()}/api/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
    };

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message ?? "회원가입에 실패했습니다." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to complete signup:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
