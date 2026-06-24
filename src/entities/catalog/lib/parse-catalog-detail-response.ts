import type { CollectionDetail } from "../model/types";
import { parseCatalogItemsResponse } from "./parse-catalog-response";

function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readNumber(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function parseCatalogDetailResponse(data: unknown): CollectionDetail | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const items = parseCatalogItemsResponse([data]);
  if (items.length === 0) {
    return null;
  }

  const record = data as Record<string, unknown>;

  return {
    ...items[0],
    achievementRate: readNumber(record, "achievementRate"),
    rewardCouponName: readString(record, "rewardCouponName"),
  };
}
