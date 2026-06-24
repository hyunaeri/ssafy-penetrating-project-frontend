import { getAccessToken } from "@/entities/session";
import { getCurrentUser } from "@/entities/user";
import { getApiBaseUrl } from "@/shared/api";
import { parseCatalogDetailResponse } from "../lib/parse-catalog-detail-response";
import { parseCatalogItemsResponse } from "../lib/parse-catalog-response";
import type { CollectionDetail, CollectionItem } from "../model/types";

/** 로그인 사용자의 도감(업적) 목록 조회 */
export async function fetchCatalogItems(): Promise<CollectionItem[]> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const user = await getCurrentUser();
  const params = new URLSearchParams({ userId: String(user.id) });
  const res = await fetch(`${getApiBaseUrl()}/api/catalog?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as { message?: string };
    throw new Error(err.message ?? "도감을 불러오지 못했습니다.");
  }

  return parseCatalogItemsResponse(data);
}

/** 도감(업적) 상세 조회 */
export async function fetchCatalogItemDetail(
  achievementId: number,
): Promise<CollectionDetail> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const user = await getCurrentUser();
  const params = new URLSearchParams({ userId: String(user.id) });
  const res = await fetch(
    `${getApiBaseUrl()}/api/catalog/${achievementId}?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as { message?: string };
    throw new Error(err.message ?? "도감 상세를 불러오지 못했습니다.");
  }

  const detail = parseCatalogDetailResponse(data);
  if (!detail) {
    throw new Error("도감 상세를 불러오지 못했습니다.");
  }

  return detail;
}

export { parseCatalogItemsResponse };