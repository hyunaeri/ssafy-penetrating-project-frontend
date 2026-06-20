"use client";

import { useEffect, useState } from "react";
import type {
  CouponDiscountType,
  CouponPayload,
  CouponResponse,
} from "@/entities/admin-coupon";
import { MENU_TAGS } from "@/features/admin-shared";
import { PrimaryButton, notifyError } from "@/shared/ui";

type CouponFormState = {
  name: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderPrice: number;
  targetTagId: string;
};

const DEFAULT_FORM: CouponFormState = {
  name: "",
  description: "",
  discountType: "AMOUNT",
  discountValue: 3000,
  minOrderPrice: 15000,
  targetTagId: "18",
};

function findTagIdFromCoupon(coupon: CouponResponse): string {
  const directId = coupon.targetTagId ?? coupon.targetTag?.id;
  if (directId != null) return String(directId);

  const code = coupon.targetTagCode ?? coupon.targetTag?.code;
  const tag = MENU_TAGS.find((item) => item.code === code);
  return tag ? String(tag.id) : "";
}

function toFormState(coupon?: CouponResponse | null): CouponFormState {
  if (!coupon) return DEFAULT_FORM;

  return {
    name: coupon.name ?? "",
    description: coupon.description ?? "",
    discountType: coupon.discountType ?? "AMOUNT",
    discountValue: coupon.discountValue ?? 0,
    minOrderPrice: coupon.minOrderPrice ?? 0,
    targetTagId: findTagIdFromCoupon(coupon),
  };
}

function toPayload(form: CouponFormState): CouponPayload {
  const payload: CouponPayload = {
    name: form.name.trim(),
    description: form.description.trim(),
    discountType: form.discountType,
    discountValue: form.discountValue,
    minOrderPrice: form.minOrderPrice,
    targetTagId: form.targetTagId ? Number(form.targetTagId) : null,
  };

  if (payload.discountType === "PERCENT" && payload.discountValue > 100) {
    throw new Error("PERCENT 할인 값은 100 이하여야 합니다.");
  }

  return payload;
}

type CouponFormPanelProps = {
  title: string;
  initial?: CouponResponse | null;
  imageRequired?: boolean;
  currentImageUrl?: string | null;
  submitting?: boolean;
  onSubmit: (payload: CouponPayload, imageFile: File | null) => Promise<void>;
};

export function CouponFormPanel({
  title,
  initial,
  imageRequired,
  currentImageUrl,
  submitting,
  onSubmit,
}: CouponFormPanelProps) {
  const [form, setForm] = useState<CouponFormState>(() => toFormState(initial));
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    setForm(toFormState(initial));
    setImageFile(null);
  }, [initial]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (imageRequired && !imageFile) {
        throw new Error("쿠폰 이미지를 선택해 주세요.");
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
            <span className="text-[13px] font-semibold">할인 타입</span>
            <select
              value={form.discountType}
              onChange={(event) =>
                setForm({
                  ...form,
                  discountType: event.target.value as CouponDiscountType,
                })
              }
              className="rounded-lg border border-line px-3 py-2 text-[14px]"
            >
              <option value="AMOUNT">AMOUNT - 정액</option>
              <option value="PERCENT">PERCENT - 비율</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold">할인 값</span>
            <input
              required
              type="number"
              min={1}
              value={form.discountValue}
              onChange={(event) =>
                setForm({ ...form, discountValue: Number(event.target.value) })
              }
              className="rounded-lg border border-line px-3 py-2 text-[14px]"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">최소 주문 금액</span>
          <input
            required
            type="number"
            min={0}
            value={form.minOrderPrice}
            onChange={(event) =>
              setForm({ ...form, minOrderPrice: Number(event.target.value) })
            }
            className="rounded-lg border border-line px-3 py-2 text-[14px]"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">대상 태그</span>
          <select
            value={form.targetTagId}
            onChange={(event) =>
              setForm({ ...form, targetTagId: event.target.value })
            }
            className="rounded-lg border border-line px-3 py-2 text-[14px]"
          >
            <option value="">전체 태그 - 제한 없음</option>
            {MENU_TAGS.map((tag) => (
              <option key={tag.id} value={String(tag.id)}>
                {tag.name} ({tag.code})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold">
            {imageRequired ? "쿠폰 이미지" : "새 쿠폰 이미지 (선택)"}
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
              alt="현재 쿠폰 이미지"
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
