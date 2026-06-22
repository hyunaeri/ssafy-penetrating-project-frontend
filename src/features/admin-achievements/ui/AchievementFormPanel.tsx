"use client";

import { useEffect, useState } from "react";
import type {
  AchievementConditionType,
  AchievementGrade,
  AchievementPayload,
  AchievementResponse,
} from "@/entities/admin-achievement";
import {
  buildConditionValue,
  defaultConditionForType,
  parseConditionValue,
  type ConditionValue,
} from "@/features/admin-achievements/lib/achievement-condition";
import { ConditionBuilder } from "@/features/admin-achievements/ui/ConditionBuilder";
import { PrimaryButton, notifyError } from "@/shared/ui";

const GRADES: AchievementGrade[] = ["NORMAL", "RARE", "UNIQUE", "LEGENDARY"];
const CONDITION_TYPES: AchievementConditionType[] = [
  "SINGLE_ORDER_TAGS",
  "ORDER_TIME_RANGE",
  "CONSECUTIVE_TAG",
  "CUMULATIVE_TAG_AMOUNT",
];

type AchievementFormState = {
  name: string;
  description: string;
  grade: AchievementGrade;
  ratingPoint: number;
  conditionType: AchievementConditionType;
  condition: ConditionValue;
  rewardCouponId: string;
  hidden: boolean;
};

const DEFAULT_FORM: AchievementFormState = {
  name: "",
  description: "",
  grade: "RARE",
  ratingPoint: 30,
  conditionType: "SINGLE_ORDER_TAGS",
  condition: defaultConditionForType("SINGLE_ORDER_TAGS"),
  rewardCouponId: "",
  hidden: false,
};

function toFormState(achievement?: AchievementResponse | null): AchievementFormState {
  if (!achievement) return DEFAULT_FORM;

  const conditionType =
    achievement.conditionType ?? "SINGLE_ORDER_TAGS";

  return {
    name: achievement.name ?? "",
    description: achievement.description ?? "",
    grade: achievement.grade ?? "RARE",
    ratingPoint: achievement.ratingPoint ?? 0,
    conditionType,
    condition: parseConditionValue(achievement.conditionValue),
    rewardCouponId: String(
      achievement.rewardCouponId ?? achievement.rewardCoupon?.id ?? ""
    ),
    hidden: Boolean(achievement.hidden ?? achievement.isHidden),
  };
}

function toPayload(form: AchievementFormState): AchievementPayload {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    grade: form.grade,
    ratingPoint: form.ratingPoint,
    conditionType: form.conditionType,
    conditionValue: buildConditionValue(form.conditionType, form.condition),
    rewardCouponId: form.rewardCouponId.trim()
      ? Number(form.rewardCouponId)
      : null,
    hidden: form.hidden,
  };
}

type AchievementFormPanelProps = {
  title: string;
  initial?: AchievementResponse | null;
  imageRequired?: boolean;
  currentImageUrl?: string | null;
  submitting?: boolean;
  onSubmit: (payload: AchievementPayload, imageFile: File | null) => Promise<void>;
};

export function AchievementFormPanel({
  title,
  initial,
  imageRequired,
  currentImageUrl,
  submitting,
  onSubmit,
}: AchievementFormPanelProps) {
  const [form, setForm] = useState<AchievementFormState>(() => toFormState(initial));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    setForm(toFormState(initial));
    setImageFile(null);
  }, [initial]);

  useEffect(() => {
    try {
      setPreview(
        JSON.stringify(
          JSON.parse(buildConditionValue(form.conditionType, form.condition)),
          null,
          2
        )
      );
    } catch (error) {
      setPreview(
        JSON.stringify(
          { error: error instanceof Error ? error.message : "조건 오류" },
          null,
          2
        )
      );
    }
  }, [form.conditionType, form.condition]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (imageRequired && !imageFile) {
        throw new Error("업적 이미지를 선택해 주세요.");
      }
      await onSubmit(toPayload(form), imageFile);
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "요청 실패");
    }
  };

  return (
    <section className="soft-card p-5">
      <h3 className="text-[16px] font-bold text-ink">{title}</h3>

      <form className="mt-4 space-y-3" onSubmit={(event) => void handleSubmit(event)}>
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">이름</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="rounded-lg border border-line px-3 py-2 text-[14px]"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">설명</span>
          <textarea
            required
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            className="min-h-20 rounded-lg border border-line px-3 py-2 text-[14px]"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold">등급</span>
            <select
              value={form.grade}
              onChange={(event) =>
                setForm({ ...form, grade: event.target.value as AchievementGrade })
              }
              className="rounded-lg border border-line px-3 py-2 text-[14px]"
            >
              {GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold">레이팅 포인트</span>
            <input
              required
              type="number"
              min={0}
              value={form.ratingPoint}
              onChange={(event) =>
                setForm({ ...form, ratingPoint: Number(event.target.value) })
              }
              className="rounded-lg border border-line px-3 py-2 text-[14px]"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">조건 타입</span>
          <select
            value={form.conditionType}
            onChange={(event) => {
              const conditionType = event.target.value as AchievementConditionType;
              setForm({
                ...form,
                conditionType,
                condition: defaultConditionForType(conditionType),
              });
            }}
            className="rounded-lg border border-line px-3 py-2 text-[14px]"
          >
            {CONDITION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <ConditionBuilder
          conditionType={form.conditionType}
          value={form.condition}
          onChange={(condition) => setForm({ ...form, condition })}
        />

        <pre className="overflow-x-auto rounded-lg bg-[#111827] p-3 text-[12px] text-[#e5e7eb]">
          {preview}
        </pre>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">보상 쿠폰 ID</span>
          <input
            type="number"
            min={1}
            value={form.rewardCouponId}
            onChange={(event) =>
              setForm({ ...form, rewardCouponId: event.target.value })
            }
            placeholder="없으면 비워두기"
            className="rounded-lg border border-line px-3 py-2 text-[14px]"
          />
        </label>

        <label className="flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={form.hidden}
            onChange={(event) => setForm({ ...form, hidden: event.target.checked })}
          />
          숨김 업적
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">
            {imageRequired ? "업적 이미지" : "새 업적 이미지 (선택)"}
          </span>
          <input
            type="file"
            accept="image/*"
            required={imageRequired}
            onChange={(event) =>
              setImageFile(event.target.files?.[0] ?? null)
            }
            className="text-[13px]"
          />
        </label>

        {currentImageUrl && (
          <div className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImageUrl}
              alt="현재 업적 이미지"
              className="h-20 w-20 rounded-lg border border-line object-cover"
            />
            <p className="break-all text-[12px] text-muted">{currentImageUrl}</p>
          </div>
        )}

        <PrimaryButton type="submit" disabled={submitting}>
          {submitting ? "요청 중..." : title}
        </PrimaryButton>
      </form>
    </section>
  );
}

export { toFormState as achievementToFormState };
