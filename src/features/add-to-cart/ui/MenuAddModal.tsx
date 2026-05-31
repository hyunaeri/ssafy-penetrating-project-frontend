"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { MenuResponse } from "@/entities/store";
import { CartStoreConflictModal } from "@/features/add-to-cart/ui/CartStoreConflictModal";
import { useAddToCart } from "@/features/add-to-cart/hooks/use-add-to-cart";
import { formatWon } from "@/features/category-stores/lib/format-store-display";
import { useBodyScrollLock } from "@/shared/lib/use-body-scroll-lock";
import { notifyError, notifySuccess, toastMessages } from "@/shared/ui";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

type MenuAddModalProps = {
  menu: MenuResponse;
  minOrderPrice: number;
  onClose: () => void;
};

function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  disabled,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-line">
      <button
        type="button"
        aria-label="수량 줄이기"
        disabled={disabled || quantity <= MIN_QUANTITY}
        onClick={onDecrease}
        className="flex h-10 w-10 items-center justify-center text-[20px] text-ink transition-colors disabled:text-line"
      >
        −
      </button>
      <span className="min-w-[40px] text-center text-[16px] font-semibold text-ink">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="수량 늘리기"
        disabled={disabled || quantity >= MAX_QUANTITY}
        onClick={onIncrease}
        className="flex h-10 w-10 items-center justify-center text-[20px] text-ink transition-colors disabled:text-line"
      >
        +
      </button>
    </div>
  );
}

export function MenuAddModal({ menu, minOrderPrice, onClose }: MenuAddModalProps) {
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [imageFailed, setImageFailed] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const { submitting, conflict, clearConflict, add, confirmReplace } =
    useAddToCart();

  useEffect(() => setMounted(true), []);

  useBodyScrollLock(true);

  useEffect(() => {
    setQuantity(MIN_QUANTITY);
    setImageFailed(false);
    setDescExpanded(false);
    clearConflict();
  }, [menu.id, clearConflict]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, submitting]);

  if (!mounted) return null;

  const imageUrl = menu.imageUrl?.trim();
  const showImage = Boolean(imageUrl) && !imageFailed;
  const description = menu.description?.trim();
  const lineTotal = menu.price * quantity;

  const handleAdd = async (replaceCart = false) => {
    try {
      const ok = await add({
        menuId: menu.id,
        quantity,
        replaceCart,
      });

      if (ok) {
        notifySuccess(toastMessages.cart.addSuccess);
        onClose();
      }
    } catch (err) {
      notifyError(
        err instanceof Error ? err.message : toastMessages.cart.addFail.description
      );
    }
  };

  const handleConfirmReplace = async () => {
    try {
      const ok = await confirmReplace();
      if (ok) {
        notifySuccess(toastMessages.cart.addSuccess);
        onClose();
      }
    } catch (err) {
      notifyError(
        err instanceof Error ? err.message : toastMessages.cart.addFail.description
      );
    }
  };

  return createPortal(
    <>
      <div className="fixed inset-y-0 left-0 right-0 z-[200] mx-auto flex w-full max-w-mobile flex-col bg-white">
        <div className="relative h-[240px] w-full shrink-0 bg-surface">
          {showImage ? (
            <Image
              src={imageUrl!}
              alt=""
              fill
              className="object-cover"
              sizes="430px"
              priority
              unoptimized
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-line/50 text-[48px] font-semibold text-muted/60">
              {menu.name.charAt(0)}
            </div>
          )}

          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            disabled={submitting}
            className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M14 6 8 12l6 6" />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[88px]">
          <div className="px-4 pt-4">
            <h2 className="text-[22px] font-bold leading-tight text-ink">
              {menu.name}
            </h2>

            {description && (
              <div className="mt-2">
                <p
                  className={`text-[14px] leading-relaxed text-muted ${
                    descExpanded ? "" : "line-clamp-3"
                  }`}
                >
                  {description}
                </p>
                {description.length > 80 && (
                  <button
                    type="button"
                    onClick={() => setDescExpanded((prev) => !prev)}
                    className="mt-1 text-[13px] font-medium text-muted underline-offset-2 hover:underline"
                  >
                    {descExpanded ? "접기" : "더보기"}
                  </button>
                )}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-line py-4">
              <span className="text-[15px] font-semibold text-ink">가격</span>
              <span className="text-[18px] font-bold text-ink">
                {formatWon(menu.price)}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-line py-4">
              <span className="text-[15px] font-semibold text-ink">수량</span>
              <QuantityStepper
                quantity={quantity}
                disabled={submitting}
                onDecrease={() =>
                  setQuantity((q) => Math.max(MIN_QUANTITY, q - 1))
                }
                onIncrease={() =>
                  setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))
                }
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-line bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <p className="mb-2 text-center text-[12px] text-muted">
            배달 최소주문금액 {formatWon(minOrderPrice)}
          </p>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleAdd(false)}
            className="flex h-[52px] w-full items-center justify-center rounded-xl bg-[#2ac1bc] text-[16px] font-bold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? "담는 중…" : `${formatWon(lineTotal)} 담기`}
          </button>
        </div>
      </div>

      <CartStoreConflictModal
        open={conflict != null}
        message={conflict?.message ?? ""}
        loading={submitting}
        onCancel={clearConflict}
        onConfirm={() => void handleConfirmReplace()}
      />
    </>,
    document.body
  );
}
