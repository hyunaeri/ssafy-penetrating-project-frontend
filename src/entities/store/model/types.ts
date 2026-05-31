export type StoreResponse = {
  id: number;
  name: string;
  imageUrl?: string | null;
  description?: string | null;
  categoryId?: number | null;
  foodCategoryId?: number | null;
  minimumOrderPrice?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  deliveryTime?: string | null;
  deliveryTimeMinutes?: number | null;
  deliveryFee?: number | null;
  deliveryFeeMin?: number | null;
  deliveryFeeMax?: number | null;
};

export type MenuResponse = {
  id: number;
  storeId: number;
  tagId: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  active: boolean;
};

export type StoreDetailResponse = {
  id: number;
  categoryId: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  address?: string | null;
  minOrderPrice: number;
  deliveryFee: number;
  menus: MenuResponse[];
};
