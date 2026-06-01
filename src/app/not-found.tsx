import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <p className="text-[18px] font-bold text-ink">페이지를 찾을 수 없어요</p>
      <p className="text-[14px] leading-relaxed text-muted">
        요청하신 페이지가 존재하지 않거나 이동되었어요.
      </p>
      <Link href="/main" className="brand-cta h-11 px-6">
        메인으로 이동
      </Link>
    </div>
  );
}

