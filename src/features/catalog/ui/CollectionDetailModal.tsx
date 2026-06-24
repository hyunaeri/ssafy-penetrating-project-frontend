"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { CollectionItem } from "@/entities/catalog";
import { getGradeStyle } from "@/entities/catalog";
import { useBodyScrollLock } from "@/shared/lib/use-body-scroll-lock";
import { useCatalogItemDetail } from "../hooks/use-catalog-item-detail";
import { CollectionCardVisual } from "./CollectionCardVisual";
import { AchievementRateSection } from "./AchievementRateSection";
import { HiddenAchievementBee } from "./HiddenAchievementBee";

type CollectionDetailModalProps = {
  item: CollectionItem;
  onClose: () => void;
};

function formatAchievedAt(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function CollectionDetailModal({
  item,
  onClose,
}: CollectionDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const { detail, loading } = useCatalogItemDetail(item.id);

  useEffect(() => setMounted(true), []);
  useBodyScrollLock(true);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!mounted) return null;

  const current = detail ?? item;
  const style = getGradeStyle(current.grade);
  const achievedLabel = formatAchievedAt(current.achievedAt);

  return createPortal(
    <div
      className="fixed inset-0 z-[220] mx-auto flex max-w-mobile items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="collection-detail-title"
        className="relative flex max-h-[88vh] w-full flex-col rounded-t-3xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <h2 id="collection-detail-title" className="text-[18px] font-bold text-ink">
            도감 상세
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="mx-auto w-full max-w-[240px]">
            <CollectionCardVisual
              key={`${current.id}-${current.imageUrl ?? ""}-${current.collected}`}
              grade={current.grade}
              collected={current.collected}
              imageUrl={current.imageUrl}
              name={current.name}
              maxWidthClass="max-w-[240px]"
              imageSizes="240px"
            />
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5">
            <h3 className="text-[20px] font-bold text-ink">{current.name}</h3>
            {current.hidden && <HiddenAchievementBee />}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ring-inset ${style.badgeClass}`}
            >
              {style.label}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ring-inset ${
                current.collected
                  ? "bg-brand-soft text-brand-dark ring-brand/20"
                  : "bg-surface text-muted ring-line"
              }`}
            >
              {current.collected ? "수집 완료" : "미수집"}
            </span>
            {current.ratingPoint > 0 && (
              <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-1 text-[12px] font-semibold text-muted ring-1 ring-inset ring-line">
                +{current.ratingPoint}P
              </span>
            )}
          </div>

          {!loading && current.collected && achievedLabel && (
            <p className="mt-3 text-center text-[13px] text-muted">
              {achievedLabel}에 달성했어요
            </p>
          )}

          <section className="mt-6 rounded-2xl bg-surface px-4 py-4">
            <h4 className="text-[13px] font-bold text-ink">해금 방법</h4>
            {loading ? (
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                불러오는 중...
              </p>
            ) : (
              <p className="mt-2 whitespace-pre-wrap break-words text-[14px] leading-relaxed text-muted">
                {current.description || "해금 조건 정보가 없습니다."}
              </p>
            )}
          </section>

          {!loading && detail?.achievementRate != null && (
            <AchievementRateSection
              grade={current.grade}
              rate={detail.achievementRate}
            />
          )}

          {!loading && detail?.rewardCouponName && (
            <p className="mt-2 text-center text-[12px] text-brand-dark">
              보상: {detail.rewardCouponName}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
