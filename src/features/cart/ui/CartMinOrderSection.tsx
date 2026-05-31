import { formatWon } from "@/features/category-stores/lib/format-store-display";

type CartMinOrderSectionProps = {
  minOrderPrice: number;
  subtotal: number;
  remainingMinOrderPrice: number;
};

export function CartMinOrderSection({
  minOrderPrice,
  subtotal,
  remainingMinOrderPrice,
}: CartMinOrderSectionProps) {
  if (minOrderPrice <= 0) return null;

  const progress = Math.min(100, Math.round((subtotal / minOrderPrice) * 100));
  const met = remainingMinOrderPrice === 0;

  return (
    <section className="mx-3 mt-3 soft-card p-4">
      <div className="flex items-center justify-between text-[14px]">
        <span className="font-semibold text-ink">최소주문금액</span>
        <span className="font-bold text-brand-dark">{formatWon(minOrderPrice)}</span>
      </div>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-surface"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="최소주문금액 진행률"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            met ? "bg-brand" : "bg-brand/70"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2.5 text-[13px] leading-relaxed">
        {met ? (
          <span className="font-semibold text-brand-dark">
            최소주문금액을 충족했어요
          </span>
        ) : (
          <span className="text-muted">
            <span className="font-semibold text-brand-dark">
              {formatWon(remainingMinOrderPrice)}
            </span>{" "}
            더 담으면 주문할 수 있어요
          </span>
        )}
      </p>
    </section>
  );
}
