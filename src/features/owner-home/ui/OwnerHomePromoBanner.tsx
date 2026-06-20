import Link from "next/link";

/** 점주 홈 상단 프로모션 배너. 클릭 시 주문 관리로 이동. */
export function OwnerHomePromoBanner() {
  return (
    <Link
      href="/owner/orders"
      className="relative block overflow-hidden rounded-card bg-gradient-to-br from-[#eef6ff] to-[#dceeff] px-5 py-4 shadow-card transition-transform active:scale-[0.99]"
    >
      <div className="relative z-[1] max-w-[72%]">
        <p className="text-[12px] font-bold text-accent-blue-text">
          실시간 주문 확인
        </p>
        <p className="mt-1 whitespace-pre-line text-[18px] font-bold leading-tight tracking-tight text-ink">
          들어온 주문{"\n"}놓치지 않기!
        </p>
        <span className="mt-2 inline-flex items-center gap-0.5 text-[13px] font-semibold text-ink/80">
          주문 관리 바로가기
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
        className="pointer-events-none absolute -right-1 bottom-0 z-0 text-[80px] leading-none opacity-90"
        aria-hidden
      >
        📋
      </span>
    </Link>
  );
}
