export type FoodCategory = {
  id: string;
  label: string;
  image: string;
};

/** 메인 화면 카테고리 (표시 순서). */
export const FOOD_CATEGORIES: FoodCategory[] = [
  { id: "franchise", label: "프랜차이즈", image: "franchise.png" },
  { id: "chicken", label: "치킨", image: "chicken.png" },
  { id: "pizza", label: "피자/양식", image: "pizza.png" },
  { id: "china", label: "중국집", image: "china.png" },
  { id: "korea", label: "한식", image: "korea.png" },
  { id: "japan", label: "일식/돈까스", image: "japan.png" },
  { id: "jokbal", label: "족발/보쌈", image: "jokbal.png" },
  { id: "night", label: "야식", image: "night.png" },
  { id: "snack", label: "분식", image: "snack.png" },
  { id: "dessert", label: "카페/디저트", image: "dessert.png" },
];
