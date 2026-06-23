"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createReview } from "@/entities/review";
import { isDuplicateReviewError } from "@/features/review/lib/is-duplicate-review-error";
import { StarRatingInput } from "@/features/review/ui/StarRating";
import { useBodyScrollLock } from "@/shared/lib/use-body-scroll-lock";
import { notifyError, notifySuccess } from "@/shared/ui";

const MAX_CONTENT_LENGTH = 500;
const MIN_CONTENT_LENGTH = 5;
const SHORT_CONTENT_MESSAGE =
  "너무 짧아요~ 리뷰 내용은 5자 이상 써주세요.";

type ReviewWriteModalProps = {
  orderId: number;
  storeName: string;
  menuName: string;
  onClose: () => void;
  onSubmitted?: () => void;
};

function ReviewShortContentAlert({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center px-8">
      <button
        type="button"
        aria-label="안내 닫기"
        onClick={onDismiss}
        className="absolute inset-0 bg-black/15"
      />
      <div
        role="alert"
        className="relative w-full max-w-[300px] rounded-2xl bg-[#3f3f3f] px-5 py-4 text-center text-[13px] leading-relaxed text-white shadow-[0_8px_28px_rgba(0,0,0,0.22)]"
      >
        {message}
      </div>
    </div>
  );
}

export function ReviewWriteModal({
  orderId,
  storeName,
  menuName,
  onClose,
  onSubmitted,
}: ReviewWriteModalProps) {
  const [mounted, setMounted] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showShortContentHint, setShowShortContentHint] = useState(false);

  useEffect(() => setMounted(true), []);
  useBodyScrollLock(true);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, submitting]);

  if (!mounted) return null;

  const trimmed = content.trim();
  const canSubmit = !submitting;

  const handleSubmit = async () => {
    if (submitting) return;

    if (trimmed.length < MIN_CONTENT_LENGTH) {
      setShowShortContentHint(true);
      return;
    }

    setShowShortContentHint(false);

    if (rating < 1) return;

    setSubmitting(true);
    try {
      await createReview(orderId, { rating, content: trimmed });
      notifySuccess("리뷰가 등록되었어요.");
      onSubmitted?.();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "리뷰 작성에 실패했습니다.";
      if (isDuplicateReviewError(message)) {
        notifySuccess("이미 작성한 리뷰예요.");
        onSubmitted?.();
        onClose();
        return;
      }
      notifyError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[220] mx-auto flex max-w-mobile items-end justify-center bg-black/40">
      {showShortContentHint && (
        <ReviewShortContentAlert
          message={SHORT_CONTENT_MESSAGE}
          onDismiss={() => setShowShortContentHint(false)}
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-write-title"
        className="relative flex max-h-[90vh] w-full flex-col rounded-t-3xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <h2 id="review-write-title" className="text-[18px] font-bold text-ink">
            리뷰 쓰기
          </h2>
          <button
            type="button"
            aria-label="닫기"
            disabled={submitting}
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
          <p className="text-center text-[24px] font-bold text-ink">{storeName}</p>
          <p className="mt-1 text-center text-[14px] text-muted">{menuName}</p>
          <div className="mt-4">
            <StarRatingInput
              value={rating}
              disabled={submitting}
              onChange={setRating}
            />
          </div>

          <label className="mt-6 block">
            <span className="mb-2 block text-[14px] font-semibold text-ink">
              리뷰 내용
            </span>
            <textarea
              value={content}
              disabled={submitting}
              maxLength={MAX_CONTENT_LENGTH}
              placeholder="음식은 어떠셨나요? 솔직한 리뷰를 남겨주세요."
              onChange={(event) => {
                const next = event.target.value;
                setContent(next);
                if (next.trim().length >= MIN_CONTENT_LENGTH) {
                  setShowShortContentHint(false);
                }
              }}
              className="min-h-[140px] w-full resize-none rounded-2xl border border-line bg-surface px-3.5 py-3 text-[14px] leading-relaxed text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none"
            />
            <span className="mt-1 block text-right text-[12px] text-muted">
              {trimmed.length}/{MAX_CONTENT_LENGTH}
            </span>
          </label>
        </div>

        <div className="border-t border-line px-4 py-3">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => void handleSubmit()}
            className="brand-cta h-[52px] w-full text-[16px] font-bold disabled:opacity-60"
          >
            {submitting ? "등록 중…" : "리뷰 등록"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
