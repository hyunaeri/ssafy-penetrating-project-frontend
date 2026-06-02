import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

type RouteContext = {
  params: Promise<{ storeId: string }>;
};

/** `POST /api/favorites/:storeId` — 찜 추가 (백엔드 `/api/v1/favorites/{storeId}` 프록시). */
export async function POST(req: NextRequest, { params }: RouteContext) {
  const token = req.headers.get("authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { storeId } = await params;
  if (!storeId || Number.isNaN(Number(storeId))) {
    return NextResponse.json(
      { message: "요청 경로가 올바르지 않습니다." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/favorites/${storeId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      }
    );

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to add favorite store:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/** `DELETE /api/favorites/:storeId` — 찜 해제 (백엔드 `/api/v1/favorites/{storeId}` 프록시). */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const token = req.headers.get("authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { storeId } = await params;
  if (!storeId || Number.isNaN(Number(storeId))) {
    return NextResponse.json(
      { message: "요청 경로가 올바르지 않습니다." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/favorites/${storeId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      }
    );

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to remove favorite store:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
