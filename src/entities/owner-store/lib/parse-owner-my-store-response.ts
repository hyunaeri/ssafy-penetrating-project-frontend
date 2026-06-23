import type { StoreDetailResponse } from "@/entities/store/model/types";

function readNumber(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return null;
}

function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

/** 백엔드 점주 매장 조회 JSON을 프론트 타입으로 정규화 */
export function parseOwnerMyStoreResponse(
  data: unknown
): StoreDetailResponse | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const record = data as Record<string, unknown>;
  const id = readNumber(record, ["id"]);
  const categoryId = readNumber(record, ["categoryId", "category_id"]);
  const name = readString(record, "name");
  const minOrderPrice = readNumber(record, ["minOrderPrice", "minimumOrderPrice"]);
  const deliveryFee = readNumber(record, ["deliveryFee", "delivery_fee"]);

  if (
    id == null ||
    categoryId == null ||
    !name ||
    minOrderPrice == null ||
    deliveryFee == null
  ) {
    return null;
  }

  return {
    id,
    categoryId,
    name,
    description: readString(record, "description"),
    imageUrl: readString(record, "imageUrl"),
    address: readString(record, "address"),
    minOrderPrice,
    deliveryFee,
    menus: [],
    reviews: [],
  };
}
