import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/shared/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** `PATCH /api/cart/items/:id` — 장바구니 수량 변경 (백엔드 `/api/v1/cart/items/:id` 프록시). */
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const token = req.headers.get("authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id || Number.isNaN(Number(id))) {
    return NextResponse.json(
      { message: "요청 경로가 올바르지 않습니다." },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "요청 본문이 올바르지 않습니다." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${getBackendUrl()}/api/v1/cart/items/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to update cart item quantity:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/** `DELETE /api/cart/items/:id` — 장바구니 항목 삭제 (백엔드 `/api/v1/cart/items/:id` 프록시). */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const token = req.headers.get("authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id || Number.isNaN(Number(id))) {
    return NextResponse.json(
      { message: "요청 경로가 올바르지 않습니다." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${getBackendUrl()}/api/v1/cart/items/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to delete cart item:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

