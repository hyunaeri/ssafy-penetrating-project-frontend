import type { MenuResponse, StoreDetailResponse } from "@/entities/store/model/types";

function isMenuLike(value: unknown): value is MenuResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as MenuResponse).id === "number" &&
    typeof (value as MenuResponse).name === "string" &&
    typeof (value as MenuResponse).price === "number"
  );
}

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

/** 백엔드 `StoreDetailResponse` JSON을 프론트 타입으로 정규화 */
export function parseStoreDetailResponse(data: unknown): StoreDetailResponse | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const record = data as Record<string, unknown>;
  const id = readNumber(record, ["id"]);
  const categoryId = readNumber(record, ["categoryId"]);
  const name = readString(record, "name");
  const minOrderPrice = readNumber(record, ["minOrderPrice", "minimumOrderPrice"]);
  const deliveryFee = readNumber(record, ["deliveryFee"]);

  if (
    id == null ||
    categoryId == null ||
    !name ||
    minOrderPrice == null ||
    deliveryFee == null
  ) {
    return null;
  }

  const rawMenus = record.menus;
  const menus = Array.isArray(rawMenus)
    ? rawMenus.filter(isMenuLike).filter((menu) => menu.active !== false)
    : [];

  return {
    id,
    categoryId,
    name,
    description: readString(record, "description"),
    imageUrl: readString(record, "imageUrl"),
    address: readString(record, "address"),
    minOrderPrice,
    deliveryFee,
    menus,
  };
}
