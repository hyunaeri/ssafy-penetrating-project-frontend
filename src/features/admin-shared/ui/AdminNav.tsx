"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/entities/admin-auth";
import { useAppRouter } from "@/shared/lib/use-app-router";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드", exact: true as const },
  { href: "/admin/achievements", label: "업적 관리", exact: false as const },
  { href: "/admin/coupons", label: "쿠폰 관리", exact: false as const },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useAppRouter();

  const handleLogout = () => {
    logoutAdmin();
    router.replace("/admin/login");
  };

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-line bg-white">
      <div className="border-b border-line px-5 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Admin
        </p>
        <h1 className="mt-1 text-[18px] font-bold text-ink">관리자</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2.5 text-[14px] font-semibold transition-colors ${
                active
                  ? "bg-brand-soft text-brand-dark"
                  : "text-ink hover:bg-surface"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-lg px-3 py-2.5 text-left text-[14px] font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          로그아웃
        </button>
      </div>
    </aside>
  );
}
