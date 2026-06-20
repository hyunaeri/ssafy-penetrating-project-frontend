import type {
  CouponPayload,
  CouponResponse,
} from "@/entities/admin-coupon/model/types";
import { getAccessToken } from "@/entities/session";
import { getApiBaseUrl } from "@/shared/api";

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  if (!token) throw new Error("로그인이 필요합니다.");
  return { Authorization: `Bearer ${token}` };
}

function createMultipartBody(
  requestData: CouponPayload,
  imageFile?: File | null
): FormData {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(requestData)], { type: "application/json" })
  );
  if (imageFile) {
    formData.append("image", imageFile);
  }
  return formData;
}

export async function fetchCoupons(keyword?: string): Promise<unknown> {
  const params = keyword?.trim()
    ? `?keyword=${encodeURIComponent(keyword.trim())}`
    : "";
  const res = await fetch(`${getApiBaseUrl()}/api/admin/coupons${params}`, {
    headers: { ...authHeaders(), Accept: "application/json" },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "쿠폰 목록 조회에 실패했습니다.");
  }
  return res.json();
}

export async function fetchCoupon(couponId: number): Promise<unknown> {
  const res = await fetch(`${getApiBaseUrl()}/api/admin/coupons/${couponId}`, {
    headers: { ...authHeaders(), Accept: "application/json" },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "쿠폰 조회에 실패했습니다.");
  }
  return res.json();
}

export async function createCoupon(
  payload: CouponPayload,
  imageFile: File
): Promise<unknown> {
  const res = await fetch(`${getApiBaseUrl()}/api/admin/coupons`, {
    method: "POST",
    headers: authHeaders(),
    body: createMultipartBody(payload, imageFile),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "쿠폰 생성에 실패했습니다.");
  }
  return res.json();
}

export async function updateCoupon(
  couponId: number,
  payload: CouponPayload,
  imageFile?: File | null
): Promise<unknown> {
  const res = await fetch(`${getApiBaseUrl()}/api/admin/coupons/${couponId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: createMultipartBody(payload, imageFile),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "쿠폰 수정에 실패했습니다.");
  }
  return res.json();
}

export async function deleteCoupon(couponId: number): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/api/admin/coupons/${couponId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "쿠폰 삭제에 실패했습니다.");
  }
}

export function getCouponId(coupon: CouponResponse): number | null {
  return coupon.id ?? coupon.couponId ?? null;
}
