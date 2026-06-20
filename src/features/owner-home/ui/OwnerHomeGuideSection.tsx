import Link from "next/link";

const GUIDE_ITEMS = [
  {
    title: "신규 주문 접수",
    description: "주문 탭에서 들어온 주문을 확인하고 접수할 수 있어요.",
    href: "/owner/orders",
  },
  {
    title: "매장·메뉴 관리",
    description: "매장 정보와 메뉴를 수정하고 판매 상태를 관리해요.",
    href: "/owner/store",
  },
] as const;

export function OwnerHomeGuideSection() {
  return (
    <section className="rounded-card bg-white py-4 shadow-card">
      <div className="flex items-center justify-between px-4 pb-1">
        <h2 className="text-[16px] font-bold tracking-tight text-ink">
          매장 운영 가이드
        </h2>
        <span className="text-[12px] font-semibold text-muted">점주 전용</span>
      </div>

      <ul className="divide-y divide-line/80 px-1">
        {GUIDE_ITEMS.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className="flex flex-col gap-1 px-3 py-4 transition-colors hover:bg-surface/80 active:bg-surface"
            >
              <span className="text-[15px] font-bold text-ink">{item.title}</span>
              <span className="text-[13px] leading-relaxed text-muted">
                {item.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
