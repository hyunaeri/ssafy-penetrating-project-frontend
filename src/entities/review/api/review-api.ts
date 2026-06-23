import type {
  ReviewCreateRequest,
  ReviewResponse,
} from "@/entities/review/model/types";
import { getAccessToken } from "@/entities/session";
import { getApiBaseUrl } from "@/shared/api";

export async function createReview(
  orderId: number,
  request: ReviewCreateRequest
): Promise<ReviewResponse> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(`${getApiBaseUrl()}/api/orders/${orderId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    let message = "리뷰 작성에 실패했습니다.";
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  return res.json();
}
