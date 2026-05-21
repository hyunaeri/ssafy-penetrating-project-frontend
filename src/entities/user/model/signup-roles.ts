import type { SignupRole } from "./types";

export const SIGNUP_ROLES: {
  value: SignupRole;
  label: string;
  description: string;
}[] = [
  {
    value: "CUSTOMER",
    label: "주문 고객",
    description: "맛집을 찾고 주문 · 리뷰를 남깁니다",
  },
  {
    value: "OWNER",
    label: "매장 사장",
    description: "매장 정보와 메뉴를 관리합니다",
  },
  {
    value: "RIDER",
    label: "라이더",
    description: "배달 요청을 수락하고 배송합니다",
  },
];
