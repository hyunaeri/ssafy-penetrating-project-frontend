"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useCartBadge } from "@/features/cart/hooks/use-cart-badge";
import { CartBadgeDot } from "@/features/cart/ui/CartBadgeDot";
import { resolveRepresentativeImage } from "@/shared/lib/resolve-representative-image";
import { LazyImage } from "@/shared/ui/lazy-image/LazyImage";
import { useAppRouter } from "@/shared/lib/use-app-router";

type StoreHeroProps = {
  name: string;
  imageUrl?: string | null;
};

function HeroIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/35 active:bg-black/40"
    >
      {children}
    </button>
  );
}

export function StoreHero({ name, imageUrl }: StoreHeroProps) {
  const router = useAppRouter();
  const { itemCount, hasItems } = useCartBadge();
  const [imageFailed, setImageFailed] = useState(false);
  const src = resolveRepresentativeImage(imageUrl, imageFailed);

  return (
    <div className="relative h-[220px] w-full shrink-0 bg-ink">
      <LazyImage
        src={src}
        alt=""
        fill
        className="object-cover"
        sizes="430px"
        priority
        onError={() => setImageFailed(true)}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-3 pb-2 pt-3">
        <HeroIconButton label="이전 페이지로 돌아가기" onClick={() => router.back()}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M14 6 8 12l6 6" />
          </svg>
        </HeroIconButton>

        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Link
              href="/cart"
              aria-label={
                hasItems ? `장바구니, ${itemCount}개 담김` : "장바구니"
              }
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/35"
            >
              <svg
                width="20"
                height="20"
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
            </Link>
            <CartBadgeDot count={itemCount} variant="dark" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-4 z-10 flex items-end gap-2">
        <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-white shadow-md ring-2 ring-white/90">
          <LazyImage
            src={src}
            alt={name}
            fill
            className="object-cover"
            sizes="44px"
            onError={() => setImageFailed(true)}
          />
        </div>
      </div>
    </div>
  );
}
