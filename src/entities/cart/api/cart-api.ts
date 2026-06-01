import {
  CartStoreConflictError,
  isCartStoreConflictResponse,
} from "@/entities/cart/lib/cart-store-conflict-error";
import { parseCartResponse } from "@/entities/cart/lib/parse-cart-response";
import type {
  AddCartItemRequest,
  CartItemResponse,
  CartResponse,
} from "@/entities/cart/model/types";
import { getAccessToken } from "@/entities/session";
import { getApiBaseUrl } from "@/shared/api";

function isCartItemResponse(data: unknown): data is CartItemResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as CartItemResponse).id === "number" &&
    typeof (data as CartItemResponse).menuId === "number" &&
    typeof (data as CartItemResponse).quantity === "number"
  );
}

/** `GET /api/cart` — 장바구니 조회 */
export async function fetchCart(): Promise<CartResponse> {
  const token = getAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/api/cart`, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let message = "장바구니를 불러오지 못했습니다.";
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  return parseCartResponse(await res.json());
}

/** `POST /api/cart/items` — 장바구니에 메뉴 담기 */
export async function addCartItem(
  request: AddCartItemRequest
): Promise<CartItemResponse> {
  const token = getAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/api/cart/items`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(request),
  });

  const data: unknown = await res.json().catch(() => ({}));

  if (res.status === 409 && isCartStoreConflictResponse(data)) {
    throw new CartStoreConflictError(data);
  }

  if (!res.ok) {
    let message = "장바구니에 담지 못했습니다.";
    if (typeof data === "object" && data !== null && "message" in data) {
      const msg = (data as { message?: string }).message;
      if (msg) message = msg;
    }
    throw new Error(message);
  }

  if (!isCartItemResponse(data)) {
    throw new Error("장바구니 응답 형식이 올바르지 않습니다.");
  }

  return data;
}

export type UpdateCartItemQuantityRequest = {
  quantity: number;
};

/** `PATCH /api/cart/items/:id` — 장바구니 메뉴 수량 변경 */
export async function updateCartItemQuantity(
  cartItemId: number,
  request: UpdateCartItemQuantityRequest
): Promise<CartItemResponse> {
  const token = getAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/api/cart/items/${cartItemId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(request),
  });

  const data: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    let message = "수량을 변경하지 못했습니다.";
    if (typeof data === "object" && data !== null && "message" in data) {
      const msg = (data as { message?: string }).message;
      if (msg) message = msg;
    }
    throw new Error(message);
  }

  if (!isCartItemResponse(data)) {
    throw new Error("장바구니 응답 형식이 올바르지 않습니다.");
  }

  return data;
}
