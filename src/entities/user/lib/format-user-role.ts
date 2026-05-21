import { SIGNUP_ROLES } from "@/entities/user/model/signup-roles";
import type { UserRole } from "@/entities/user/model/types";

const ROLE_LABELS: Record<UserRole, string> = {
  CUSTOMER: "주문 고객",
  OWNER: "매장 사장",
  RIDER: "라이더",
  ADMIN: "관리자",
};

/** 사용자 역할 enum 값을 화면 표시용 라벨로 변환한다. */
export function formatUserRole(role: UserRole): string {
  return (
    SIGNUP_ROLES.find((item) => item.value === role)?.label ??
    ROLE_LABELS[role] ??
    role
  );
}
