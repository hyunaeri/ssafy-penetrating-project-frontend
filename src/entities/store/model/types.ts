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
