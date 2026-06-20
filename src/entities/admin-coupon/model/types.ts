export type CouponDiscountType = "AMOUNT" | "PERCENT";

export type CouponPayload = {
  name: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderPrice: number;
  targetTagId: number | null;
};

export type CouponResponse = {
  id?: number;
  couponId?: number;
  name?: string;
  description?: string;
  discountType?: CouponDiscountType;
  discountValue?: number;
  minOrderPrice?: number;
  targetTagId?: number | null;
  targetTag?: { id?: number; code?: string };
  targetTagCode?: string;
  imageUrl?: string;
  couponImageUrl?: string;
};
