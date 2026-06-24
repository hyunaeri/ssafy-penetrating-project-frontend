import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

type RouteContext = {
  params: Promise<{ achievementId: string }>;
};

/** `GET /api/catalog/:achievementId?userId=:id` — 도감 상세 (백엔드 `/api/v1/achievements/{id}` 프록시). */
export async function GET(req: NextRequest, { params }: RouteContext) {
  const token = req.headers.get("authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { achievementId } = await params;
  const id = Number(achievementId);
  if (!achievementId || !Number.isFinite(id) || id <= 0) {
    return NextResponse.json(
      { message: "요청 경로가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const userIdParam = req.nextUrl.searchParams.get("userId");
  const userId = Number(userIdParam);
  if (!userIdParam || !Number.isFinite(userId) || userId <= 0) {
    return NextResponse.json(
      { message: "사용자 정보가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const target = new URL(`${getBackendUrl()}/api/v1/achievements/${id}`);
  target.searchParams.set("userId", String(userId));

  try {
    const response = await fetch(target, {
      method: "GET",
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = data as { message?: string };
      return NextResponse.json(
        { message: err.message ?? "도감 상세를 불러오지 못했습니다." },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch catalog achievement detail:", error);
    return NextResponse.json(
      { message: "도감 상세를 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
