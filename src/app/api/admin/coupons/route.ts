import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";
import { getBearerToken, unauthorizedResponse } from "@/shared/api/proxy-auth";

/** `GET/POST /api/admin/coupons` — 쿠폰 목록·생성 프록시. */
export async function GET(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token) return unauthorizedResponse();

  const keyword = req.nextUrl.searchParams.get("keyword");
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/admin/coupons${query}`,
      {
        method: "GET",
        headers: { Authorization: token, Accept: "application/json" },
      }
    );
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy admin coupons list:", error);
    return NextResponse.json(
      { message: "쿠폰 목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token) return unauthorizedResponse();

  try {
    const formData = await req.formData();
    const response = await fetch(`${getBackendUrl()}/api/v1/admin/coupons`, {
      method: "POST",
      headers: { Authorization: token, Accept: "application/json" },
      body: formData,
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy admin coupon create:", error);
    return NextResponse.json(
      { message: "쿠폰 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
