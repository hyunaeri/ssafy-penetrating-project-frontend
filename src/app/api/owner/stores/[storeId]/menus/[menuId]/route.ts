import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";
import { getBearerToken, unauthorizedResponse } from "@/shared/api/proxy-auth";

type RouteContext = {
  params: Promise<{ storeId: string; menuId: string }>;
};

/** `PATCH /api/owner/stores/[storeId]/menus/[menuId]` — 메뉴 수정 (multipart 프록시). */
export async function PATCH(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const { storeId, menuId } = await context.params;

  try {
    const formData = await req.formData();
    const response = await fetch(
      `${getBackendUrl()}/api/v1/owner/stores/${storeId}/menus/${menuId}`,
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
    console.error("Failed to proxy owner menu update:", error);
    return NextResponse.json(
      { message: "메뉴 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/** `DELETE /api/owner/stores/[storeId]/menus/[menuId]` — 메뉴 삭제 프록시. */
export async function DELETE(req: NextRequest, context: RouteContext) {
  const token = getBearerToken(req);
  if (!token) {
    return unauthorizedResponse();
  }

  const { storeId, menuId } = await context.params;

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/owner/stores/${storeId}/menus/${menuId}`,
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
    console.error("Failed to proxy owner menu delete:", error);
    return NextResponse.json(
      { message: "메뉴 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
