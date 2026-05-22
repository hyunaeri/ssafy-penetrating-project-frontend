import {
  filterStoresByCategory,
  parseStoresResponse,
} from "@/entities/store/lib/parse-stores-response";
import type { StoreResponse } from "@/entities/store/model/types";
import { getAccessToken } from "@/entities/session";
import { getApiBaseUrl } from "@/shared/api";

export async function fetchStoresByCategory(
  categoryId: number
): Promise<StoreResponse[]> {
  const token = getAccessToken();
  const params = new URLSearchParams({ categoryId: String(categoryId) });

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

  const stores = parseStoresResponse(await res.json());
  return filterStoresByCategory(stores, categoryId);
}
