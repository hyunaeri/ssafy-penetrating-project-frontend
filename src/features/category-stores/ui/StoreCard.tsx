"use client";

import Link from "next/link";
import { memo, useState, type ReactNode } from "react";
import type { StoreResponse } from "@/entities/store";
import {
  formatDeliveryTime,
  formatReviewCount,
  formatWon,
} from "@/features/category-stores/lib/format-store-display";
import { resolveRepresentativeImage } from "@/shared/lib/resolve-representative-image";
import { LazyImage } from "@/shared/ui/lazy-image/LazyImage";

type StoreCardProps = {
  store: StoreResponse;
};

function StarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      className="text-[#e8a317]"
      aria-hidden
    >
      <path d="M6 1.2 7.55 4.5l3.6.32-2.72 2.36.82 3.52L6 9.1 3.75 10.7l.82-3.52L1.85 4.82l3.6-.32L6 1.2Z" />
    </svg>
  );
}

function MetaItem({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-[12px] text-muted">
      <span className="text-muted/80">{icon}</span>
      {children}
    </span>
  );
}

export const StoreCard = memo(function StoreCard({ store }: StoreCardProps) {
  const imageUrl = store.imageUrl?.trim();
  const [imageFailed, setImageFailed] = useState(false);
  const src = resolveRepresentativeImage(imageUrl, imageFailed);
  const deliveryTime = formatDeliveryTime(
    store.deliveryTime,
    store.deliveryTimeMinutes
  );
  const deliveryFeeMin = store.deliveryFeeMin ?? store.deliveryFee;
  const deliveryFeeMax = store.deliveryFeeMax;

  return (
    <Link
      href={`/stores/${store.id}`}
      className="mx-3 my-2 flex w-[calc(100%-1.5rem)] gap-3.5 rounded-card bg-white p-3 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(42,193,188,0.12)] active:scale-[0.99]"
    >
      <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-2xl bg-brand-soft ring-1 ring-inset ring-brand/10">
        <LazyImage
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes="88px"
          onError={() => setImageFailed(true)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <div className="flex items-start gap-2">
          <h2 className="line-clamp-1 flex-1 text-[16px] font-bold leading-snug tracking-tight text-ink">
            {store.name}
          </h2>
          {typeof store.rating === "number" && (
            <span className="inline-flex shrink-0 items-center gap-0.5 pt-0.5 text-[12px] font-semibold text-ink">
              <StarIcon />
              {store.rating.toFixed(1)}
            </span>
          )}
        </div>

        {store.description?.trim() && (
          <p className="line-clamp-1 text-[13px] leading-snug text-muted">
            {store.description.trim()}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {typeof store.rating === "number" &&
            typeof store.reviewCount === "number" &&
            store.reviewCount > 0 && (
              <span className="text-[12px] text-muted">
                리뷰 {formatReviewCount(store.reviewCount)}
              </span>
            )}

          {deliveryTime && (
            <MetaItem
              icon={
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" strokeLinecap="round" />
                </svg>
              }
            >
              {deliveryTime}
            </MetaItem>
          )}

          {typeof store.minimumOrderPrice === "number" && (
            <MetaItem
              icon={
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden
                >
                  <path d="M6 8h12M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 8v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
                </svg>
              }
            >
              최소주문 {formatWon(store.minimumOrderPrice)}
            </MetaItem>
          )}
        </div>

        {(deliveryFeeMin != null || deliveryFeeMax != null) && (
          <p className="text-[12px] text-muted">
            배달팁{" "}
            {deliveryFeeMin != null && deliveryFeeMax != null
              ? `${formatWon(deliveryFeeMin)}~${formatWon(deliveryFeeMax)}`
              : deliveryFeeMin != null
                ? formatWon(deliveryFeeMin)
                : formatWon(deliveryFeeMax!)}
          </p>
        )}
      </div>
    </Link>
  );
});
