import type { StoreResponse } from "@/entities/store/model/types";
import { parseStoresResponse } from "./parse-stores-response";

export type StoresCursorResult = {
  stores: StoreResponse[];
  nextCursor: number | null;
  hasNext: boolean;
};

function readBoolean(value: unknown): boolean {
  return value === true || value === "true";
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** 백엔드 cursor 응답 `{ stores, nextCursor, hasNext }` 파싱 */
export function parseStoresCursorResponse(data: unknown): StoresCursorResult {
  const stores = parseStoresResponse(data);

  if (typeof data !== "object" || data === null) {
    return { stores, nextCursor: null, hasNext: false };
  }

  const record = data as Record<string, unknown>;
  const hasCursorFields =
    "hasNext" in record ||
    "has_next" in record ||
    "nextCursor" in record ||
    "next_cursor" in record;

  if (!hasCursorFields) {
    return { stores, nextCursor: null, hasNext: false };
  }

  return {
    stores,
    nextCursor: readNumber(record.nextCursor ?? record.next_cursor),
    hasNext: readBoolean(record.hasNext ?? record.has_next),
  };
}
