import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";
import { getBearerToken, unauthorizedResponse } from "@/shared/api/proxy-auth";

type RouteContext = {
  params: Promise<{ storeId: string }>;
};

/** `PATCH /api/owner/stores/[storeId]` — 매장 수정 (백엔드 multipart 프록시). */
export async function PATCH(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const { storeId } = await context.params;

  try {
    const formData = await req.formData();
    const response = await fetch(
      `${getBackendUrl()}/api/v1/owner/stores/update/${storeId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
        body: formData,
      }
    );

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to proxy owner store update:", error);
    return NextResponse.json(
      { message: "매장 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/** `DELETE /api/owner/stores/[storeId]` — 매장 삭제 (백엔드 프록시). */
export async function DELETE(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const { storeId } = await context.params;

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/owner/stores/delete/${storeId}`,
      {
        method: "DELETE",
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
    console.error("Failed to proxy owner store delete:", error);
    return NextResponse.json(
      { message: "매장 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
