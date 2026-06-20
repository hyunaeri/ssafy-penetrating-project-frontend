export type AchievementGrade = "NORMAL" | "RARE" | "UNIQUE" | "LEGENDARY";

export type AchievementConditionType =
  | "SINGLE_ORDER_TAGS"
  | "ORDER_TIME"
  | "CONSECUTIVE_TAG"
  | "CUMULATIVE_AMOUNT_BY_TAG";

export type AchievementPayload = {
  name: string;
  description: string;
  grade: AchievementGrade;
  ratingPoint: number;
  conditionType: AchievementConditionType;
  conditionValue: string;
  rewardCouponId: number | null;
  hidden: boolean;
};

export type AchievementResponse = {
  id?: number;
  achievementId?: number;
  name?: string;
  description?: string;
  grade?: AchievementGrade;
  ratingPoint?: number;
  conditionType?: AchievementConditionType;
  conditionValue?: string | Record<string, unknown>;
  rewardCouponId?: number | null;
  rewardCoupon?: { id?: number };
  hidden?: boolean;
  isHidden?: boolean;
  imageUrl?: string;
};
