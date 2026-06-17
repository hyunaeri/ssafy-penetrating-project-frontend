export type FoodCategory = {
  /** DB `food_categories.id` — 동적 라우팅 `/categories/[id]` 에 사용 */
  id: number;
  /** DB `food_categories.name` */
  name: string;
  /** DB `food_categories.image_url` (현재는 로컬 public 이미지 경로) */
  imageUrl: string;
};

/** 메인 화면 카테고리 (DB id·표시 순서와 동일). */
export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 1,
    name: "프랜차이즈",
    imageUrl: "/images/franchise-pixel.png",
  },
  {
    id: 2,
    name: "치킨",
    imageUrl: "/images/chicken-pixel.png",
  },
  {
    id: 3,
    name: "피자/양식",
    imageUrl: "/images/pizza-pixel.png",
  },
  {
    id: 4,
    name: "중국집",
    imageUrl: "/images/china-pixel.png",
  },
  {
    id: 5,
    name: "한식",
    imageUrl: "/images/korea-pixel.png",
  },
  {
    id: 6,
    name: "일식/돈까스",
    imageUrl: "/images/japan-pixel.png",
  },
  {
    id: 7,
    name: "족발/보쌈",
    imageUrl: "/images/jokbal-pixel.png",
  },
  {
    id: 8,
    name: "야식",
    imageUrl: "/images/night-pixel.png",
  },
  {
    id: 9,
    name: "분식",
    imageUrl: "/images/snack-pixel.png",
  },
  {
    id: 10,
    name: "카페/디저트",
    imageUrl: "/images/dessert-pixel.png",
  },
];
