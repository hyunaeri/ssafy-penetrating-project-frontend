"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/shared/lib/use-body-scroll-lock";
import { PrimaryButton } from "@/shared/ui";

type OwnerMenuDeleteConfirmModalProps = {
  open: boolean;
  menuName: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function OwnerMenuDeleteConfirmModal({
  open,
  menuName,
  loading = false,
  onCancel,
  onConfirm,
}: OwnerMenuDeleteConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel, loading]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-5">
      <button
        type="button"
        aria-label="삭제 확인 닫기"
        className="absolute inset-0 bg-black/45"
        disabled={loading}
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="owner-menu-delete-title"
        className="relative z-10 w-full max-w-[320px] rounded-[1.35rem] bg-white p-5 shadow-soft"
      >
        <h2
          id="owner-menu-delete-title"
          className="text-[17px] font-bold leading-snug text-ink"
        >
          메뉴를 삭제할까요?
        </h2>
        <div className="mt-2 space-y-1.5 text-[14px] leading-relaxed text-muted">
          <p>
            <span className="font-semibold text-ink">{menuName}</span> 메뉴가
            목록에서 제거됩니다.
          </p>
          <p>삭제한 메뉴는 복구할 수 없어요.</p>
        </div>

        <div className="mt-5 flex gap-2">
          <PrimaryButton
            type="button"
            variant="outline"
            className="h-11 flex-1 text-[14px]"
            disabled={loading}
            onClick={onCancel}
          >
            취소
          </PrimaryButton>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex h-11 flex-1 items-center justify-center rounded-button bg-red-600 text-[14px] font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
