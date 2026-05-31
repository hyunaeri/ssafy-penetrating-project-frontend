"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/shared/lib/use-body-scroll-lock";
import { PrimaryButton } from "@/shared/ui";

type CartStoreConflictModalProps = {
  open: boolean;
  message: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function CartStoreConflictModal({
  open,
  message,
  loading = false,
  onCancel,
  onConfirm,
}: CartStoreConflictModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel, loading]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-5">
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-black/45"
        disabled={loading}
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cart-conflict-title"
        className="relative z-10 w-full max-w-[320px] rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
      >
        <h2
          id="cart-conflict-title"
          className="text-[17px] font-bold text-ink"
        >
          장바구니를 비울까요?
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{message}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          다른 매장 메뉴를 담으려면 기존 장바구니를 비우고 새로 담아야 합니다.
        </p>

        <div className="mt-5 flex gap-2">
          <PrimaryButton
            type="button"
            variant="outline"
            className="flex-1"
            disabled={loading}
            onClick={onCancel}
          >
            취소
          </PrimaryButton>
          <PrimaryButton
            type="button"
            className="flex-1"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "담는 중…" : "비우고 담기"}
          </PrimaryButton>
        </div>
      </div>
    </div>,
    document.body
  );
}
