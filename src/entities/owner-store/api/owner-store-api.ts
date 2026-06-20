import {
  appendJsonPart,
  authHeaders,
  parseEmptyResponse,
  parseJsonResponse,
} from "@/entities/owner-store/lib/owner-api-utils";
import { parseOwnerMyStoreResponse } from "@/entities/owner-store/lib/parse-owner-my-store-response";
import type {
  OwnerStoreMutationResponse,
  OwnerStorePayload,
} from "@/entities/owner-store/model/types";
import { getAccessToken } from "@/entities/session";
import type { StoreDetailResponse } from "@/entities/store/model/types";
import { getApiBaseUrl } from "@/shared/api";

type RegisterStoreParams = OwnerStorePayload & {
  image?: File | null;
};

type UpdateStoreParams = RegisterStoreParams & {
  storeId: number;
};

async function buildStoreFormData(
  payload: OwnerStorePayload,
  image?: File | null
) {
  const formData = new FormData();
  appendJsonPart(formData, "request", payload);
  if (image) {
    formData.append("img", image);
  }
  return formData;
}

/** 점주 본인 매장 조회. 등록된 매장이 없으면 null. */
export async function fetchMyOwnerStore(): Promise<StoreDetailResponse | null> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(`${getApiBaseUrl()}/api/owner/stores/me`, {
    headers: authHeaders(token),
  });

  if (res.status === 404) {
    return null;
  }

  const data = await parseJsonResponse<unknown>(
    res,
    "매장 정보를 불러오지 못했습니다."
  );

  const store = parseOwnerMyStoreResponse(data);
  if (!store) {
    throw new Error("매장 정보 형식이 올바르지 않습니다.");
  }

  return store;
}

/** 점주 매장 등록 */
export async function registerOwnerStore({
  image,
  ...payload
}: RegisterStoreParams): Promise<number> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(`${getApiBaseUrl()}/api/owner/stores/register`, {
    method: "POST",
    headers: authHeaders(token),
    body: await buildStoreFormData(payload, image),
  });

  const data = await parseJsonResponse<OwnerStoreMutationResponse>(
    res,
    "매장 등록에 실패했습니다."
  );

  return data.id;
}

/** 점주 매장 정보 수정 */
export async function updateOwnerStore({
  storeId,
  image,
  ...payload
}: UpdateStoreParams): Promise<number> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(`${getApiBaseUrl()}/api/owner/stores/${storeId}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: await buildStoreFormData(payload, image),
  });

  const data = await parseJsonResponse<OwnerStoreMutationResponse>(
    res,
    "매장 수정에 실패했습니다."
  );

  return data.id;
}

/** 점주 매장 삭제 */
export async function deleteOwnerStore(storeId: number): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(`${getApiBaseUrl()}/api/owner/stores/${storeId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  await parseEmptyResponse(res, "매장 삭제에 실패했습니다.");
}
