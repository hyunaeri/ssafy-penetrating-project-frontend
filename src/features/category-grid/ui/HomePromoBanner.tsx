import Link from "next/link";
import { getCategoryPath } from "@/entities/category";

/** 홈 상단 정적 프로모션 배너. 클릭 시 치킨 카테고리로 이동. */
export function HomePromoBanner() {
  return (
    <Link
      href={getCategoryPath(2)}
      className="relative block overflow-hidden rounded-card bg-gradient-to-br from-[#fff4e6] to-[#ffe9cc] px-5 py-4 shadow-card transition-transform active:scale-[0.99]"
    >
      <div className="relative z-[1] max-w-[70%]">
        <p className="text-[12px] font-bold text-accent-warm-text">
          지금 가입하면
        </p>
        <p className="mt-1 whitespace-pre-line text-[18px] font-bold leading-tight tracking-tight text-ink">
          치킨 먹을 복{"\n"}쿠폰 받고 주문!
        </p>
        <span className="mt-2 inline-flex items-center gap-0.5 text-[13px] font-semibold text-ink/80">
          지금 받으러 가기
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </span>
      </div>

      <span
        className="pointer-events-none absolute -right-2 bottom-0 z-0 text-[88px] leading-none opacity-90"
        aria-hidden
      >
        🍗
      </span>
    </Link>
  );
}
