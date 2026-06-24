import type { BottomNavItem } from "@/widgets/bottom-nav/model/items";

export const CUSTOMER_BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { href: "/main", label: "홈", icon: "home" },
  { href: "/favorite", label: "찜", icon: "favorite" },
  { href: "/catalog", label: "도감", icon: "catalog" },
  { href: "/orders", label: "주문내역", icon: "orders" },
  { href: "/profile", label: "마이페이지", icon: "profile" },
];
