export type OrderStatus =
  | "PAYMENT_PENDING"
  | "PAID"
  | "ACCEPTED"
  | "COOKING"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELED";

export type OrderItemResponse = {
  id: number;
  menuId: number;
  menuName: string;
  menuPrice: number;
  tagCode?: string | null;
  quantity: number;
  subtotalPrice: number;
};

export type OrderResponse = {
  id: number;
  userId: number;
  storeId: number;
  storeName?: string | null;
  storeImageUrl?: string | null;
  riderId?: number | null;
  couponId?: number | null;
  totalPrice: number;
  deliveryFee: number;
  finalPrice: number;
  status: OrderStatus;
  orderedAt: string;
  completedAt?: string | null;
  items: OrderItemResponse[];
};
