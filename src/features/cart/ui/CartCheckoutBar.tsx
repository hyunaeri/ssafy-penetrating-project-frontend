import { formatWon } from "@/features/category-stores/lib/format-store-display";

type CartCheckoutBarProps = {
  total: number;
  itemCount: number;
  disabled: boolean;
  shortOfMin: number;
  onCheckout?: () => void;
};

export function CartCheckoutBar({
  total,
  itemCount,
  disabled,
  shortOfMin,
  onCheckout,
}: CartCheckoutBarProps) {
  return (
    <div className="fixed bottom-[64px] left-0 right-0 z-20 mx-auto w-full max-w-mobile rounded-t-[20px] bg-white px-4 pb-4 pt-3.5 shadow-[0_-8px_32px_rgba(43,45,66,0.12)]">
      {shortOfMin > 0 && (
        <p className="mb-2.5 text-center text-[12px] text-muted">
          최소주문금액까지{" "}
          <span className="font-semibold text-brand-dark">
            {formatWon(shortOfMin)}
          </span>{" "}
          더 담아주세요
        </p>
      )}

      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[18px] font-bold leading-none text-ink">
            {formatWon(total)}
          </p>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={onCheckout}
          className="flex h-[52px] min-w-[148px] flex-1 items-center justify-center gap-2 rounded-full bg-brand px-5 text-[15px] font-bold text-ink shadow-[0_4px_16px_rgba(42,193,188,0.35)] transition-all hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:opacity-70 disabled:shadow-none disabled:active:scale-100"
        >
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1.5 text-[12px] font-bold text-white">
            {itemCount}
          </span>
          결제하기
        </button>
      </div>
    </div>
  );
}
