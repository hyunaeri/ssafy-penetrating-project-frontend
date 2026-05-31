export type AddCartItemRequest = {
  menuId: number;
  quantity: number;
  replaceCart: boolean;
};

export type CartItemResponse = {
  id: number;
  userId: number;
  menuId: number;
  quantity: number;
};

export type CartStoreConflictResponse = {
  code: string;
  message: string;
  currentStoreId: number;
  requestedStoreId: number;
};

export type CartLineResponse = {
  id: number;
  menuId: number;
  quantity: number;
  menuName: string;
  menuDescription?: string | null;
  menuImageUrl?: string | null;
  unitPrice: number;
};

export type CartResponse = {
  storeId?: number | null;
  storeName?: string | null;
  storeImageUrl?: string | null;
  minOrderPrice?: number | null;
  deliveryFee?: number | null;
  /** 메뉴 금액 합계 */
  totalMenuPrice?: number | null;
  /** 메뉴 금액 + 배달팁 (배달 기준) */
  totalPaymentPrice?: number | null;
  /** 최소주문금액까지 남은 금액 (0이면 충족) */
  remainingMinOrderPrice?: number | null;
  items: CartLineResponse[];
};
