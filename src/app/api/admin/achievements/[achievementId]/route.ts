import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";
import { getBearerToken, unauthorizedResponse } from "@/shared/api/proxy-auth";

type RouteContext = { params: Promise<{ achievementId: string }> };

/** `PUT/DELETE /api/admin/achievements/[achievementId]` */
export async function PUT(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) return unauthorizedResponse();

  const { achievementId } = await context.params;

  try {
    const formData = await req.formData();
    const response = await fetch(
      `${getBackendUrl()}/api/v1/admin/achievements/${achievementId}`,
      {
        method: "PUT",
        headers: { Authorization: token, Accept: "application/json" },
        body: formData,
      }
    );
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy admin achievement update:", error);
    return NextResponse.json(
      { message: "업적 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) return unauthorizedResponse();

  const { achievementId } = await context.params;

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/admin/achievements/${achievementId}`,
      {
        method: "DELETE",
        headers: { Authorization: token, Accept: "application/json" },
      }
    );
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy admin achievement delete:", error);
    return NextResponse.json(
      { message: "업적 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
