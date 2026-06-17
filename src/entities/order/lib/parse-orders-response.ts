import type {
  OrderItemResponse,
  OrderResponse,
  OrderStatus,
} from "@/entities/order/model/types";

const ORDER_STATUSES: OrderStatus[] = [
  "PAYMENT_PENDING",
  "PAID",
  "ACCEPTED",
  "COOKING",
  "DELIVERING",
  "COMPLETED",
  "CANCELED",
];

function readNumber(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return null;
}

function readString(
  record: Record<string, unknown>,
  keys: string[]
): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function parseOrderStatus(value: unknown): OrderStatus | null {
  if (typeof value !== "string") return null;
  return ORDER_STATUSES.includes(value as OrderStatus)
    ? (value as OrderStatus)
    : null;
}

function parseOrderItem(data: unknown): OrderItemResponse | null {
  if (typeof data !== "object" || data === null) return null;
  const record = data as Record<string, unknown>;

  const id = readNumber(record, ["id"]);
  const menuId = readNumber(record, ["menuId", "menu_id"]);
  const menuName = readString(record, ["menuName", "menu_name"]);
  const menuPrice = readNumber(record, ["menuPrice", "menu_price", "unitPrice"]);
  const quantity = readNumber(record, ["quantity"]);
  const subtotalPrice = readNumber(record, ["subtotalPrice", "subtotal_price"]);

  if (
    id == null ||
    menuId == null ||
    !menuName ||
    menuPrice == null ||
    quantity == null ||
    subtotalPrice == null
  ) {
    return null;
  }

  const tagCode = readString(record, ["tagCode", "tag_code"]);

  return {
    id,
    menuId,
    menuName,
    menuPrice,
    tagCode,
    quantity,
    subtotalPrice,
  };
}

function parseStoreFields(record: Record<string, unknown>) {
  const nestedStore =
    typeof record.store === "object" && record.store !== null
      ? (record.store as Record<string, unknown>)
      : null;

  const storeName =
    readString(record, ["storeName", "store_name"]) ??
    (nestedStore ? readString(nestedStore, ["name", "storeName"]) : null);

  const storeImageUrl =
    readString(record, ["storeImageUrl", "store_image_url", "storeImageURL"]) ??
    (nestedStore
      ? readString(nestedStore, ["imageUrl", "image_url", "storeImageUrl"])
      : null);

  return { storeName, storeImageUrl };
}

/** 백엔드 주문 JSON을 프론트 `OrderResponse`로 정규화 */
export function parseOrderResponse(data: unknown): OrderResponse | null {
  if (typeof data !== "object" || data === null) return null;
  const record = data as Record<string, unknown>;

  const id = readNumber(record, ["id"]);
  const userId = readNumber(record, ["userId", "user_id"]);
  const storeId = readNumber(record, ["storeId", "store_id"]);
  const totalPrice = readNumber(record, ["totalPrice", "total_price"]);
  const deliveryFee = readNumber(record, ["deliveryFee", "delivery_fee"]);
  const finalPrice = readNumber(record, ["finalPrice", "final_price"]);
  const status = parseOrderStatus(record.status);
  const orderedAt = readString(record, ["orderedAt", "ordered_at"]);
  const itemsRaw = record.items;

  if (
    id == null ||
    userId == null ||
    storeId == null ||
    totalPrice == null ||
    deliveryFee == null ||
    finalPrice == null ||
    !status ||
    !orderedAt ||
    !Array.isArray(itemsRaw)
  ) {
    return null;
  }

  const items = itemsRaw
    .map(parseOrderItem)
    .filter((item): item is OrderItemResponse => item != null);

  const { storeName, storeImageUrl } = parseStoreFields(record);
  const completedAt = readString(record, ["completedAt", "completed_at"]);
  const riderId = readNumber(record, ["riderId", "rider_id"]);
  const couponId = readNumber(record, ["couponId", "coupon_id"]);

  return {
    id,
    userId,
    storeId,
    storeName,
    storeImageUrl,
    riderId,
    couponId,
    totalPrice,
    deliveryFee,
    finalPrice,
    status,
    orderedAt,
    completedAt,
    items,
  };
}

/** 백엔드 주문 목록 JSON을 프론트 타입 배열로 정규화 */
export function parseOrdersResponse(data: unknown): OrderResponse[] {
  const list = Array.isArray(data)
    ? data
    : typeof data === "object" &&
        data !== null &&
        Array.isArray((data as { content?: unknown }).content)
      ? (data as { content: unknown[] }).content
      : null;

  if (!list) return [];

  return list
    .map(parseOrderResponse)
    .filter((order): order is OrderResponse => order != null);
}
