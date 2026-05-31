"use client";

import { useCartBadge } from "@/features/cart/hooks/use-cart-badge";
import { CartBadgeDot } from "@/features/cart/ui/CartBadgeDot";
import { HeaderIconLink } from "@/shared/ui/header-icon-link";

export function CartEntryButton() {
  const { itemCount, hasItems } = useCartBadge();

  return (
    <div className="relative shrink-0">
      <HeaderIconLink
        href="/cart"
        label={
          hasItems ? `장바구니, ${itemCount}개 담김` : "장바구니"
        }
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 6h15l-1.5 9h-12L6 6Z" />
          <path d="M6 6 5 3H3" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
      </HeaderIconLink>
      <CartBadgeDot count={itemCount} />
    </div>
  );
}
