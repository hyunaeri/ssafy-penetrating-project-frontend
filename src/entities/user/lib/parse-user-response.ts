import type { UserResponse, UserRole } from "@/entities/user/model/types";

const USER_ROLES: UserRole[] = ["CUSTOMER", "OWNER", "RIDER", "ADMIN"];

function readRating(record: Record<string, unknown>): number {
  const value = record.rating ?? record.rating_point;

  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }

  return 0;
}

function readUserRole(value: unknown): UserRole {
  if (typeof value === "string" && USER_ROLES.includes(value as UserRole)) {
    return value as UserRole;
  }

  return "CUSTOMER";
}

export function parseUserResponse(raw: unknown): UserResponse {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid user response");
  }

  const record = raw as Record<string, unknown>;

  return {
    id: typeof record.id === "number" ? record.id : Number(record.id) || 0,
    email: typeof record.email === "string" ? record.email : "",
    nickname: typeof record.nickname === "string" ? record.nickname : "",
    profileImageUrl:
      typeof record.profileImageUrl === "string"
        ? record.profileImageUrl
        : record.profileImageUrl === null
          ? null
          : typeof record.profile_image_url === "string"
            ? record.profile_image_url
            : null,
    provider: typeof record.provider === "string" ? record.provider : "",
    role: readUserRole(record.role),
    phoneNumber:
      typeof record.phoneNumber === "string"
        ? record.phoneNumber
        : record.phoneNumber === null
          ? null
          : undefined,
    address:
      typeof record.address === "string"
        ? record.address
        : record.address === null
          ? null
          : undefined,
    rating: readRating(record),
  };
}
