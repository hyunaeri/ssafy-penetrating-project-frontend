import type { ReviewResponse } from "@/entities/review";
import { formatReviewRelativeDate } from "@/features/review/lib/format-review";
import { StarRating } from "@/features/review/ui/StarRating";

type ReviewListItemProps = {
  review: ReviewResponse;
};

function ReviewAvatar({ nickname }: { nickname: string }) {
  const initial = nickname.trim().charAt(0) || "?";
  return (
    <div
      aria-hidden
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-[14px] font-bold text-brand-dark ring-1 ring-inset ring-line/80"
    >
      {initial}
    </div>
  );
}

export function ReviewListItem({ review }: ReviewListItemProps) {
  return (
    <article className="border-b border-line/80 px-4 py-4">
      <div className="flex items-start gap-3">
        <ReviewAvatar nickname={review.nickname} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-ink">
                {review.nickname}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-[12px] text-muted">
                  {formatReviewRelativeDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-ink">
            {review.content}
          </p>
        </div>
      </div>
    </article>
  );
}
