export type OwnerQuickAction = {
  href: string;
  label: string;
  emoji: string;
  background: string;
};

export const OWNER_QUICK_ACTIONS: OwnerQuickAction[] = [
  {
    href: "/owner/orders",
    label: "주문 관리",
    emoji: "📋",
    background: "#f0fbfb",
  },
  {
    href: "/owner/store",
    label: "매장 관리",
    emoji: "🏪",
    background: "#fdf7ee",
  },
  {
    href: "/owner/store",
    label: "메뉴 관리",
    emoji: "🍽️",
    background: "#fff4e6",
  },
  {
    href: "/owner/profile",
    label: "내 정보",
    emoji: "👤",
    background: "#f3f0ff",
  },
];
