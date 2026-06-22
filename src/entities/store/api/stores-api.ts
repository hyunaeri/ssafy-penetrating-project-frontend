import { parseStoreDetailResponse } from "@/entities/store/lib/parse-store-detail";
import {
  parseStoresCursorResponse,
  type StoresCursorResult,
} from "@/entities/store/lib/parse-stores-cursor-response";
import {
  filterStoresByCategory,
  parseStoresResponse,
} from "@/entities/store/lib/parse-stores-response";
import type { StoreDetailResponse, StoreResponse } from "@/entities/store/model/types";
import { getAccessToken } from "@/entities/session";
import { getApiBaseUrl } from "@/shared/api";

export const CATEGORY_STORES_PAGE_SIZE = 10;

type FetchStoresParams = {
  categoryId: number;
  cursor?: number;
  size?: number;
};

async function fetchStoresResponse({
  categoryId,
  cursor,
  size,
}: FetchStoresParams): Promise<unknown> {
  const token = getAccessToken();
  const params = new URLSearchParams({ categoryId: String(categoryId) });
  if (cursor !== undefined) params.set("cursor", String(cursor));
  if (size !== undefined) params.set("size", String(size));

  const res = await fetch(`${getApiBaseUrl()}/api/stores?${params}`, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let message = "매장 목록을 불러오지 못했습니다.";
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

export async function fetchStoresByCategoryCursor(
  categoryId: number,
  options?: { cursor?: number; size?: number }
): Promise<StoresCursorResult> {
  const parsed = parseStoresCursorResponse(
    await fetchStoresResponse({
      categoryId,
      cursor: options?.cursor,
      size: options?.size ?? CATEGORY_STORES_PAGE_SIZE,
    })
  );

  return {
    ...parsed,
    stores: filterStoresByCategory(parsed.stores, categoryId),
  };
}

export async function fetchStoresByCategory(
  categoryId: number
): Promise<StoreResponse[]> {
  const data = await fetchStoresResponse({ categoryId });
  const stores = parseStoresResponse(data);
  return filterStoresByCategory(stores, categoryId);
}

export async function fetchStoreDetail(storeId: number): Promise<StoreDetailResponse> {
  const token = getAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/api/stores/${storeId}`, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let message = "매장 정보를 불러오지 못했습니다.";
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const detail = parseStoreDetailResponse(await res.json());
  if (!detail) {
    throw new Error("매장 정보 형식이 올바르지 않습니다.");
  }

  return detail;
}
