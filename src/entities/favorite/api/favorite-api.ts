import type { StoreResponse } from "@/entities/store";
import { parseStoresResponse } from "@/entities/store";
import { getAccessToken } from "@/entities/session";
import type { FavoriteStoreMutationResponse } from "@/entities/favorite/model/types";
import { getApiBaseUrl } from "@/shared/api";

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string };
    if (body.message) return body.message;
  } catch {
    /* ignore */
  }
  return fallback;
}

/** `GET /api/favorites` — 찜한 매장 목록 */
export async function fetchFavoriteStores(): Promise<StoreResponse[]> {
  const res = await fetch(`${getApiBaseUrl()}/api/favorites`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "찜 목록을 불러오지 못했습니다."));
  }

  return parseStoresResponse(await res.json());
}

/** `POST /api/favorites/:storeId` — 찜 추가 */
export async function addFavoriteStore(
  storeId: number
): Promise<FavoriteStoreMutationResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/favorites/${storeId}`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "찜하기에 실패했습니다."));
  }

  return res.json() as Promise<FavoriteStoreMutationResponse>;
}

/** `DELETE /api/favorites/:storeId` — 찜 해제 */
export async function removeFavoriteStore(
  storeId: number
): Promise<FavoriteStoreMutationResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/favorites/${storeId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "찜 해제에 실패했습니다."));
  }

  return res.json() as Promise<FavoriteStoreMutationResponse>;
}
