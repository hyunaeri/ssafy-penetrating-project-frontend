export type CollectionGrade = "NORMAL" | "EPIC" | "UNIQUE" | "LEGENDARY";

/** 백엔드 `AchievementGrade` — 프론트에서는 `EPIC`으로 매핑 */
export type AchievementGradeBackend =
  | "NORMAL"
  | "RARE"
  | "UNIQUE"
  | "LEGENDARY";

export type CollectionItem = {
  id: number;
  name: string;
  description: string;
  grade: CollectionGrade;
  imageUrl: string | null;
  ratingPoint: number;
  collected: boolean;
  /** 달성 시각 (ISO 8601). 미수집이면 null */
  achievedAt: string | null;
  hidden: boolean;
};

export type CollectionItemResponse = {
  achievementId?: number;
  id?: number;
  name?: string;
  description?: string;
  imageUrl?: string | null;
  grade?: CollectionGrade | AchievementGradeBackend | string;
  ratingPoint?: number;
  achieved?: boolean;
  collected?: boolean;
  achievedAt?: string | null;
  hidden?: boolean;
};

export type CollectionDetail = CollectionItem & {
  achievementRate: number | null;
  rewardCouponName: string | null;
};
