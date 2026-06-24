import type { CollectionGrade } from "../model/types";

/** 등급별 카드 PNG (1254×1254). public/images 기준 */
export const GRADE_CARD_IMAGES: Record<CollectionGrade, string> = {
  NORMAL: "/images/normal.png",
  EPIC: "/images/epic.png",
  UNIQUE: "/images/unique.png",
  LEGENDARY: "/images/legendary.png",
};

export const COLLECTION_CARD_ASPECT = "1 / 1" as const;

export function getGradeCardImage(grade: CollectionGrade): string {
  return GRADE_CARD_IMAGES[grade];
}
