import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";
import { getBearerToken, unauthorizedResponse } from "@/shared/api/proxy-auth";

/** `POST /api/owner/stores/register` — 매장 등록 (백엔드 multipart 프록시). */
export async function POST(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token) {
    return unauthorizedResponse();
  }

  try {
    const formData = await req.formData();
    const response = await fetch(`${getBackendUrl()}/api/v1/owner/stores/register`, {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy owner store register:", error);
    return NextResponse.json(
      { message: "매장 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
