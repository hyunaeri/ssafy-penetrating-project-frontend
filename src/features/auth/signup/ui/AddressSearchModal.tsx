"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import type { Address } from "react-daum-postcode";
import { POSTCODE_EMBED_HEIGHT } from "@/features/auth/signup/model/constants";

const DaumPostcodeEmbed = dynamic(
  () => import("react-daum-postcode").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <p className="p-4 text-[14px] text-muted">주소 검색 로딩 중…</p>
    ),
  }
);

type AddressSearchModalProps = {
  open: boolean;
  onClose: () => void;
  onComplete: (data: Address) => void;
};

export function AddressSearchModal({
  open,
  onClose,
  onComplete,
}: AddressSearchModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-5">
      <button
        type="button"
        aria-label="주소 검색 닫기"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="주소 검색"
        className="relative z-10 flex w-full max-w-mobile flex-col overflow-hidden border border-line bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-line px-4">
          <span className="text-[14px] font-medium text-ink">주소 검색</span>
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] text-muted hover:text-ink"
          >
            닫기
          </button>
        </div>
        <div
          className="w-full overflow-hidden"
          style={{ height: POSTCODE_EMBED_HEIGHT }}
        >
          <DaumPostcodeEmbed
            onComplete={onComplete}
            style={{ width: "100%", height: POSTCODE_EMBED_HEIGHT }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
