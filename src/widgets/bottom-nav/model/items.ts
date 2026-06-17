export type BottomNavIcon =
  | "home"
  | "favorite"
  | "catalog"
  | "orders"
  | "profile";

export type BottomNavItem = {
  href: string;
  label: string;
  icon: BottomNavIcon;
};

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { href: "/main", label: "홈", icon: "home" },
  { href: "/favorite", label: "찜", icon: "favorite" },
  { href: "/catalog", label: "도감", icon: "catalog" },
  { href: "/orders", label: "주문내역", icon: "orders" },
  { href: "/profile", label: "내 정보", icon: "profile" },
];

export const BOTTOM_NAV_HEIGHT_PX = 64;
