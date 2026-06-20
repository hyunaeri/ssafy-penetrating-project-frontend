export type OwnerStorePayload = {
  categoryId: number;
  name: string;
  description?: string;
  address: string;
  minOrderPrice: number;
  deliveryFee: number;
};

export type OwnerStoreMutationResponse = {
  id: number;
};
