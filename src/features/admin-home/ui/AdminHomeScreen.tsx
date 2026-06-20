import Link from "next/link";
import { AdminPageHeader } from "@/features/admin-shared";

type MenuCardIcon = "achievement" | "coupon";

const MENU_CARDS = [
  {
    href: "/admin/achievements",
    icon: "achievement" as const,
    label: "업적 관리",
    summary: "고객 업적·등급·보상을 설정합니다.",
    tasks: ["업적 생성 · 수정 · 삭제", "달성 조건 구성"],
    iconClass: "bg-amber-50 text-amber-700",
  },
  {
    href: "/admin/coupons",
    icon: "coupon" as const,
    label: "쿠폰 관리",
    summary: "할인 쿠폰을 등록하고 관리합니다.",
    tasks: ["쿠폰 생성 · 수정 · 삭제", "할인율 · 기간 설정"],
    iconClass: "bg-accent-purple text-accent-purple-text",
  },
] as const;

function AdminMenuIcon({ type }: { type: MenuCardIcon }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    "aria-hidden": true as const,
  };

  if (type === "achievement") {
    return (
      <svg {...common}>
        <path d="M8 21h8" strokeLinecap="round" />
        <path d="M12 17v4" strokeLinecap="round" />
        <path
          d="M7 4h10v5a5 5 0 0 1-10 0V4Z"
          strokeLinejoin="round"
        />
        <path
          d="M5 5H3v2a3 3 0 0 0 3 3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 5h2v2a3 3 0 0 1-3 3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.4a1.6 1.6 0 0 0 0 3.2V15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.4a1.6 1.6 0 0 0 0-3.2V9Z"
        strokeLinejoin="round"
      />
      <path d="M12 7v10" strokeLinecap="round" strokeDasharray="2.5 2.5" />
    </svg>
  );
}

function IconBadge({
  icon,
  className,
}: {
  icon: MenuCardIcon;
  className: string;
}) {
  return (
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-line/70 ${className}`}
    >
      <AdminMenuIcon type={icon} />
    </span>
  );
}

export function AdminHomeScreen() {
  return (
    <>
      <AdminPageHeader
        title="관리자 대시보드"
        description="서비스 운영에 필요한 메뉴를 선택하세요."
      />

      <div className="p-8">
        <p className="mb-4 text-[13px] font-semibold tracking-tight text-ink/50">
          관리 메뉴
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {MENU_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="soft-card group block px-6 py-6 transition-shadow hover:shadow-float"
            >
              <div className="flex items-start gap-4">
                <IconBadge icon={card.icon} className={card.iconClass} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-[17px] font-bold leading-snug text-ink">
                      {card.label}
                    </h2>
                    <span className="shrink-0 pt-0.5 text-[12px] font-semibold text-brand-dark">
                      이동 →
                    </span>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink/65">
                    {card.summary}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2 border-t border-line/80 pt-4">
                {card.tasks.map((task) => (
                  <li
                    key={task}
                    className="flex items-center gap-2.5 text-[13px] leading-snug text-muted"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand/80"
                      aria-hidden
                    />
                    {task}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
