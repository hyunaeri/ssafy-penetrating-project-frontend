import type { AchievementConditionType } from "@/entities/admin-achievement";

export type SingleOrderTagsCondition = { tagCodes: string[] };
export type OrderTimeCondition = { startTime: string; endTime: string };
export type ConsecutiveTagCondition = { tagCode: string; count: number };
export type CumulativeAmountCondition = { tagCode: string; amount: number };

export type ConditionValue =
  | SingleOrderTagsCondition
  | OrderTimeCondition
  | ConsecutiveTagCondition
  | CumulativeAmountCondition;

export function parseConditionValue(raw: unknown): ConditionValue {
  if (raw == null || raw === "") return { tagCodes: ["BURGER"] };

  if (typeof raw === "object") {
    return raw as ConditionValue;
  }

  if (typeof raw === "string") {
    return JSON.parse(raw) as ConditionValue;
  }

  return { tagCodes: ["BURGER"] };
}

export function buildConditionValue(
  conditionType: AchievementConditionType,
  condition: ConditionValue
): string {
  switch (conditionType) {
    case "SINGLE_ORDER_TAGS": {
      const value = condition as SingleOrderTagsCondition;
      const tagCodes = [...new Set(value.tagCodes.filter(Boolean))];
      if (tagCodes.length === 0) {
        throw new Error("태그는 최소 한 개 이상 필요합니다.");
      }
      return JSON.stringify({ tagCodes });
    }
    case "ORDER_TIME_RANGE": {
      const value = condition as OrderTimeCondition;
      if (!value.startTime || !value.endTime) {
        throw new Error("시작·종료 시각을 입력해 주세요.");
      }
      return JSON.stringify({
        startTime: value.startTime,
        endTime: value.endTime,
      });
    }
    case "CONSECUTIVE_TAG": {
      const value = condition as ConsecutiveTagCondition;
      if (!value.tagCode) throw new Error("태그를 선택해 주세요.");
      if (!Number.isInteger(value.count) || value.count < 1) {
        throw new Error("연속 주문 횟수는 1 이상이어야 합니다.");
      }
      return JSON.stringify({ tagCode: value.tagCode, count: value.count });
    }
    case "CUMULATIVE_TAG_AMOUNT": {
      const value = condition as CumulativeAmountCondition;
      if (!value.tagCode) throw new Error("태그를 선택해 주세요.");
      if (!Number.isInteger(value.amount) || value.amount < 1) {
        throw new Error("누적 주문 금액은 1 이상이어야 합니다.");
      }
      return JSON.stringify({ tagCode: value.tagCode, amount: value.amount });
    }
    default:
      throw new Error("지원하지 않는 조건 타입입니다.");
  }
}

export function defaultConditionForType(
  conditionType: AchievementConditionType
): ConditionValue {
  switch (conditionType) {
    case "SINGLE_ORDER_TAGS":
      return { tagCodes: ["BURGER", "CHICKEN_BURGER", "HOTDOG"] };
    case "ORDER_TIME_RANGE":
      return { startTime: "22:00", endTime: "05:00" };
    case "CONSECUTIVE_TAG":
      return { tagCode: "BLACK_BEAN_NOODLE", count: 3 };
    case "CUMULATIVE_TAG_AMOUNT":
      return { tagCode: "PASTA", amount: 500000 };
  }
}
