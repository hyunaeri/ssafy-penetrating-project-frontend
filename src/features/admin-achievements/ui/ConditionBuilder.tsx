"use client";

import type { AchievementConditionType } from "@/entities/admin-achievement";
import { MENU_TAGS } from "@/features/admin-shared";
import type { ConditionValue } from "@/features/admin-achievements/lib/achievement-condition";

type ConditionBuilderProps = {
  conditionType: AchievementConditionType;
  value: ConditionValue;
  onChange: (next: ConditionValue) => void;
};

function TagSelect({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (code: string) => void;
}) {
  return (
    <select
      value={selected}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-lg border border-line bg-white px-3 py-2 text-[14px]"
    >
      <option value="">태그 선택</option>
      {MENU_TAGS.map((tag) => (
        <option key={tag.code} value={tag.code}>
          {tag.name} ({tag.code})
        </option>
      ))}
    </select>
  );
}

export function ConditionBuilder({
  conditionType,
  value,
  onChange,
}: ConditionBuilderProps) {
  if (conditionType === "SINGLE_ORDER_TAGS") {
    const condition = value as { tagCodes: string[] };

    return (
      <div className="space-y-2 rounded-lg border border-line bg-surface p-4">
        <p className="text-[13px] text-muted">
          한 주문에 모두 포함되어야 하는 태그
        </p>
        {condition.tagCodes.map((code, index) => (
          <div key={index} className="flex gap-2">
            <TagSelect
              selected={code}
              onChange={(next) => {
                const tagCodes = [...condition.tagCodes];
                tagCodes[index] = next;
                onChange({ tagCodes });
              }}
            />
            <button
              type="button"
              className="rounded-lg border border-line px-3 text-[13px]"
              onClick={() => {
                if (condition.tagCodes.length <= 1) return;
                onChange({
                  tagCodes: condition.tagCodes.filter((_, i) => i !== index),
                });
              }}
            >
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          className="rounded-lg border border-line px-3 py-1.5 text-[13px] font-semibold"
          onClick={() =>
            onChange({ tagCodes: [...condition.tagCodes, ""] })
          }
        >
          태그 추가
        </button>
      </div>
    );
  }

  if (conditionType === "ORDER_TIME") {
    const condition = value as { startTime: string; endTime: string };
    return (
      <div className="grid gap-3 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">시작 시각</span>
          <input
            type="time"
            value={condition.startTime}
            onChange={(event) =>
              onChange({ ...condition, startTime: event.target.value })
            }
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">종료 시각</span>
          <input
            type="time"
            value={condition.endTime}
            onChange={(event) =>
              onChange({ ...condition, endTime: event.target.value })
            }
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>
    );
  }

  if (conditionType === "CONSECUTIVE_TAG") {
    const condition = value as { tagCode: string; count: number };
    return (
      <div className="space-y-3 rounded-lg border border-line bg-surface p-4">
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">대상 태그</span>
          <TagSelect
            selected={condition.tagCode}
            onChange={(tagCode) => onChange({ ...condition, tagCode })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">연속 주문 횟수</span>
          <input
            type="number"
            min={1}
            value={condition.count}
            onChange={(event) =>
              onChange({ ...condition, count: Number(event.target.value) })
            }
            className="rounded-lg border border-line px-3 py-2"
          />
        </label>
      </div>
    );
  }

  const condition = value as { tagCode: string; amount: number };
  return (
    <div className="space-y-3 rounded-lg border border-line bg-surface p-4">
      <label className="flex flex-col gap-1">
        <span className="text-[13px] font-semibold">대상 태그</span>
        <TagSelect
          selected={condition.tagCode}
          onChange={(tagCode) => onChange({ ...condition, tagCode })}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[13px] font-semibold">누적 주문 금액</span>
        <input
          type="number"
          min={1}
          step={1000}
          value={condition.amount}
          onChange={(event) =>
            onChange({ ...condition, amount: Number(event.target.value) })
          }
          className="rounded-lg border border-line px-3 py-2"
        />
      </label>
    </div>
  );
}
