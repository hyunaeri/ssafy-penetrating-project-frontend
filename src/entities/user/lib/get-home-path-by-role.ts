import type { UserRole } from "@/entities/user/model/types";

/** 역할별 기본 진입 경로 */
export function getHomePathByRole(role: UserRole): string {
  switch (role) {
    case "OWNER":
      return "/owner";
    default:
      return "/main";
  }
}

export function isCustomerRole(role: UserRole): boolean {
  return role === "CUSTOMER";
}

export function isOwnerRole(role: UserRole): boolean {
  return role === "OWNER";
}
