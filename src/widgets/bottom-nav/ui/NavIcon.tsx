import type { BottomNavIcon } from "@/widgets/bottom-nav/model/items";

type NavIconProps = {
  icon: BottomNavIcon;
  active?: boolean;
};

export function NavIcon({ icon, active = false }: NavIconProps) {
  const className = active ? "text-brand-dark" : "text-muted";

  switch (icon) {
    case "home":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={active ? 1.8 : 1.6}
          className={className}
          aria-hidden
        >
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
        </svg>
      );
    case "favorite":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={active ? 1.8 : 1.6}
          className={className}
          aria-hidden
        >
          <path d="M12 20.5s-6.7-4.35-9-8.2C1.2 8.8 3.4 5 7.1 5c2 0 3.2 1.1 4 2.1.8-1 2-2.1 4-2.1 3.7 0 5.9 3.8 4.1 7.3-2.3 3.85-9 8.2-9 8.2Z" />
        </svg>
      );
    case "catalog":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={active ? 1.8 : 1.6}
          className={className}
          aria-hidden
        >
          <path d="M5 5h5v5H5V5Zm9 0h5v5h-5V5ZM5 14h5v5H5v-5Zm9 0h5v5h-5v-5Z" />
        </svg>
      );
    case "orders":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.6}
          className={className}
          aria-hidden
        >
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case "profile":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.6}
          className={className}
          aria-hidden
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M6 19.5c1.4-3 4.1-4.5 6-4.5s4.6 1.5 6 4.5" />
        </svg>
      );
  }
}
