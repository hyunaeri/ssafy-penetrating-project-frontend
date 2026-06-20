export type BottomNavIcon =
  | "home"
  | "favorite"
  | "catalog"
  | "orders"
  | "ownerOrders"
  | "profile"
  | "store"
  | "ownerStore";

export type BottomNavItem = {
  href: string;
  label: string;
  icon: BottomNavIcon;
};

export { CUSTOMER_BOTTOM_NAV_ITEMS as BOTTOM_NAV_ITEMS } from "./customer-items";

export const BOTTOM_NAV_HEIGHT_PX = 64;
