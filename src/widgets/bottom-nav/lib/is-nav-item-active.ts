import type { BottomNavItem } from "@/widgets/bottom-nav/model/items";

/** 홈에서 진입하는 하위 화면 — 하단 네비 「홈」 활성 유지 */
const HOME_ACTIVE_PREFIXES = ["/categories", "/cart", "/stores"];

export function isBottomNavItemActive(
  pathname: string,
  item: BottomNavItem
): boolean {
  if (pathname === item.href) {
    return true;
  }

  if (item.href === "/main") {
    return HOME_ACTIVE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  }

  if (item.href === "/owner") {
    return pathname === "/owner";
  }

  return false;
}
