import type { MenuResponse } from "@/entities/store/model/types";

function isMenuLike(value: unknown): value is MenuResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as MenuResponse).id === "number" &&
    typeof (value as MenuResponse).name === "string" &&
    typeof (value as MenuResponse).price === "number"
  );
}

/** 백엔드 점주 메뉴 목록 JSON 정규화 */
export function parseOwnerMenusResponse(data: unknown): MenuResponse[] {
  if (!Array.isArray(data)) return [];
  return data.filter(isMenuLike);
}
