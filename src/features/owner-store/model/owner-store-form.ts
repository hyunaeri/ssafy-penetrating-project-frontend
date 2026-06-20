import { FOOD_CATEGORIES } from "@/entities/category/model/categories";
import type { OwnerStorePayload } from "@/entities/owner-store";

export const DEFAULT_OWNER_STORE_FORM: OwnerStorePayload = {
  categoryId: FOOD_CATEGORIES[0]?.id ?? 1,
  name: "",
  description: "",
  address: "",
  minOrderPrice: 10000,
  deliveryFee: 2000,
};

export function storeToOwnerStoreForm(store: {
  categoryId: number;
  name: string;
  description?: string | null;
  address?: string | null;
  minOrderPrice: number;
  deliveryFee: number;
}): OwnerStorePayload {
  return {
    categoryId: store.categoryId,
    name: store.name,
    description: store.description ?? "",
    address: store.address ?? "",
    minOrderPrice: store.minOrderPrice,
    deliveryFee: store.deliveryFee,
  };
}
