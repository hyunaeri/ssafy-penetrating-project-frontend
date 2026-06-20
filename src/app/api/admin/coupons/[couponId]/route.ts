import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";
import { getBearerToken, unauthorizedResponse } from "@/shared/api/proxy-auth";

type RouteContext = { params: Promise<{ couponId: string }> };

/** `GET/PUT/DELETE /api/admin/coupons/[couponId]` */
export async function GET(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) return unauthorizedResponse();

  const { couponId } = await context.params;

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/admin/coupons/${couponId}`,
      {
        method: "GET",
        headers: { Authorization: token, Accept: "application/json" },
      }
    );
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy admin coupon detail:", error);
    return NextResponse.json(
      { message: "쿠폰 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) return unauthorizedResponse();

  const { couponId } = await context.params;

  try {
    const formData = await req.formData();
    const response = await fetch(
      `${getBackendUrl()}/api/v1/admin/coupons/${couponId}`,
      {
        method: "PUT",
        headers: { Authorization: token, Accept: "application/json" },
        body: formData,
      }
    );
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy admin coupon update:", error);
    return NextResponse.json(
      { message: "쿠폰 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) return unauthorizedResponse();

  const { couponId } = await context.params;

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/admin/coupons/${couponId}`,
      {
        method: "DELETE",
        headers: { Authorization: token, Accept: "application/json" },
      }
    );
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy admin coupon delete:", error);
    return NextResponse.json(
      { message: "쿠폰 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
