import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

/** `PATCH /api/notifications/:id/read` — 특정 알림 읽음 처리 (백엔드 프록시). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  const token = req.headers.get("authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { notificationId } = await params;
  const id = Number(notificationId);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json(
      { message: "알림 정보가 올바르지 않습니다." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/notifications/${id}/read`,
      {
        method: "PATCH",
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy mark notification as read:", error);
    return NextResponse.json(
      { message: "알림 읽음 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
