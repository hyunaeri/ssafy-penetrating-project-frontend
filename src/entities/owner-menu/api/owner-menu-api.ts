import {
  appendJsonPart,
  authHeaders,
  parseEmptyResponse,
  parseJsonResponse,
} from "@/entities/owner-store/lib/owner-api-utils";
import { parseOwnerMenusResponse } from "@/entities/owner-menu/lib/parse-owner-menus-response";
import type {
  OwnerMenuMutationResponse,
  OwnerMenuPayload,
} from "@/entities/owner-menu/model/types";
import { getAccessToken } from "@/entities/session";
import type { MenuResponse } from "@/entities/store/model/types";
import { getApiBaseUrl } from "@/shared/api";

type MenuMutationParams = OwnerMenuPayload & {
  storeId: number;
  image?: File | null;
};

type UpdateMenuParams = MenuMutationParams & {
  menuId: number;
};

function buildMenuFormData(payload: OwnerMenuPayload, image?: File | null) {
  const formData = new FormData();
  appendJsonPart(formData, "request", payload);
  if (image) {
    formData.append("img", image);
  }
  return formData;
}

/** 점주 메뉴 목록 조회 */
export async function fetchOwnerMenus(storeId: number): Promise<MenuResponse[]> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(
    `${getApiBaseUrl()}/api/owner/stores/${storeId}/menus`,
    {
      headers: authHeaders(token),
    }
  );

  const data = await parseJsonResponse<unknown>(
    res,
    "메뉴 목록을 불러오지 못했습니다."
  );

  return parseOwnerMenusResponse(data);
}

/** 점주 메뉴 등록 */
export async function createOwnerMenu({
  storeId,
  image,
  ...payload
}: MenuMutationParams): Promise<number> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(
    `${getApiBaseUrl()}/api/owner/stores/${storeId}/menus`,
    {
      method: "POST",
      headers: authHeaders(token),
      body: buildMenuFormData(payload, image),
    }
  );

  const data = await parseJsonResponse<OwnerMenuMutationResponse>(
    res,
    "메뉴 등록에 실패했습니다."
  );

  return data.id;
}

/** 점주 메뉴 수정 */
export async function updateOwnerMenu({
  storeId,
  menuId,
  image,
  ...payload
}: UpdateMenuParams): Promise<number> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(
    `${getApiBaseUrl()}/api/owner/stores/${storeId}/menus/${menuId}`,
    {
      method: "PATCH",
      headers: authHeaders(token),
      body: buildMenuFormData(payload, image),
    }
  );

  const data = await parseJsonResponse<OwnerMenuMutationResponse>(
    res,
    "메뉴 수정에 실패했습니다."
  );

  return data.id;
}

/** 점주 메뉴 삭제 */
export async function deleteOwnerMenu(
  storeId: number,
  menuId: number
): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const res = await fetch(
    `${getApiBaseUrl()}/api/owner/stores/${storeId}/menus/${menuId}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    }
  );

  await parseEmptyResponse(res, "메뉴 삭제에 실패했습니다.");
}
