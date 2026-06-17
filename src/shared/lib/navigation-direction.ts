const NAV_DIRECTION_KEY = "nav-direction";

export type NavigationDirection = "forward" | "back" | "replace" | "none";

export function setNavigationDirection(direction: NavigationDirection): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(NAV_DIRECTION_KEY, direction);
}

export function consumeNavigationDirection(): NavigationDirection {
  if (typeof window === "undefined") return "none";
  const value = sessionStorage.getItem(NAV_DIRECTION_KEY) as
    | NavigationDirection
    | null;
  sessionStorage.removeItem(NAV_DIRECTION_KEY);
  if (value === "forward" || value === "back" || value === "replace") {
    return value;
  }
  return "forward";
}
