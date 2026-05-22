import {
  FOOD_CATEGORIES,
  type FoodCategory,
} from "@/entities/category/model/categories";

/** 카테고리 상세(매장 목록 등) 동적 라우트 경로 */
export function getCategoryPath(categoryId: number): string {
  return `/categories/${categoryId}`;
}

export function findFoodCategoryById(categoryId: number): FoodCategory | undefined {
  return FOOD_CATEGORIES.find((category) => category.id === categoryId);
}
