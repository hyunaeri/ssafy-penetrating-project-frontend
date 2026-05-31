"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isBottomNavItemActive } from "@/widgets/bottom-nav/lib/is-nav-item-active";
import { BOTTOM_NAV_ITEMS } from "@/widgets/bottom-nav/model/items";
import { NavIcon } from "@/widgets/bottom-nav/ui/NavIcon";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="하단 메뉴"
      className="fixed bottom-0 left-0 right-0 z-30 mx-auto w-full max-w-mobile border-t border-line/60 bg-white/95 shadow-nav backdrop-blur-md"
    >
      <ul className="grid h-16 grid-cols-5">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const active = isBottomNavItemActive(pathname, item);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex h-full flex-col items-center justify-center gap-1 transition-colors ${
                  active ? "text-brand-dark" : "text-muted hover:text-ink"
                }`}
              >
                <NavIcon icon={item.icon} active={active} />
                <span
                  className={`text-[10px] leading-none ${
                    active ? "font-bold" : "font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
