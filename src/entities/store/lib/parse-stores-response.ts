import type { StoreResponse } from "@/entities/store/model/types";

function normalizeStore(raw: StoreResponse): StoreResponse {
  const record = raw as StoreResponse & {
    minOrderPrice?: number | null;
  };
  const minFromBackend = record.minOrderPrice;
  if (
    record.minimumOrderPrice == null &&
    typeof minFromBackend === "number"
  ) {
    return { ...record, minimumOrderPrice: minFromBackend };
  }
  return record;
}

function isStoreLike(value: unknown): value is StoreResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    typeof (value as StoreResponse).id === "number" &&
    typeof (value as StoreResponse).name === "string"
  );
}

/** 백엔드 응답(배열·Page·wrapper)을 StoreResponse 배열로 정규화 */
export function parseStoresResponse(data: unknown): StoreResponse[] {
  if (Array.isArray(data)) {
    return data.filter(isStoreLike).map(normalizeStore);
  }

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;
    const candidates = [
      record.content,
      record.data,
      record.stores,
      record.items,
      record.results,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate.filter(isStoreLike).map(normalizeStore);
      }
    }
  }

  return [];
}

export function getStoreCategoryId(store: StoreResponse): number | null {
  const id = store.foodCategoryId ?? store.categoryId;
  return typeof id === "number" ? id : null;
}

export function filterStoresByCategory(
  stores: StoreResponse[],
  categoryId: number
): StoreResponse[] {
  const withCategory = stores.filter(
    (store) => getStoreCategoryId(store) !== null
  );
  if (withCategory.length === 0) {
    return stores;
  }
  return withCategory.filter(
    (store) => getStoreCategoryId(store) === categoryId
  );
}
