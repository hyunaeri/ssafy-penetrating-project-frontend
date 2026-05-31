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
  items: CartLineResponse[];
};
