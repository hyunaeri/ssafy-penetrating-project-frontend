import type { CartStoreConflictResponse } from "@/entities/cart/model/types";

export class CartStoreConflictError extends Error {
  readonly conflict: CartStoreConflictResponse;

  constructor(conflict: CartStoreConflictResponse) {
    super(conflict.message);
    this.name = "CartStoreConflictError";
    this.conflict = conflict;
  }
}

export function isCartStoreConflictResponse(
  data: unknown
): data is CartStoreConflictResponse {
  if (typeof data !== "object" || data === null) return false;
  const record = data as Record<string, unknown>;
  return (
    record.code === "CART_STORE_CONFLICT" &&
    typeof record.message === "string" &&
    typeof record.currentStoreId === "number" &&
    typeof record.requestedStoreId === "number"
  );
}
