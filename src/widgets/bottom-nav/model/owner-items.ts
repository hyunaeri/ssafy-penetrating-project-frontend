import type { BottomNavItem } from "@/widgets/bottom-nav/model/items";

export const OWNER_BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { href: "/owner", label: "홈", icon: "home" },
  { href: "/owner/orders", label: "주문 관리", icon: "ownerOrders" },
  { href: "/owner/store", label: "매장 관리", icon: "ownerStore" },
  { href: "/owner/profile", label: "내 정보", icon: "profile" },
];
