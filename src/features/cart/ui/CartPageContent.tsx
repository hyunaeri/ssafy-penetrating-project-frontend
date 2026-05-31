"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  getCartLineTotal,
  getCartSubtotal,
  type CartLineResponse,
  type CartResponse,
} from "@/entities/cart";
import { useCart } from "@/features/cart/hooks/use-cart";
import { CartCheckoutBar } from "@/features/cart/ui/CartCheckoutBar";
import {
  CartOrderTypeToggle,
  type CartOrderType,
} from "@/features/cart/ui/CartOrderTypeToggle";
import { formatWon } from "@/features/category-stores/lib/format-store-display";
import { PrimaryButton } from "@/shared/ui";

function CartLineItem({ line }: { line: CartLineResponse }) {
  const imageUrl = line.menuImageUrl?.trim();
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;
  const lineTotal = getCartLineTotal(line);

  return (
    <li className="flex gap-3.5 border-b border-line/60 py-4 last:border-b-0">
      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-brand-soft ring-1 ring-inset ring-brand/10">
        {showImage ? (
          <Image
            src={imageUrl!}
            alt=""
            fill
            className="object-cover"
            sizes="72px"
            unoptimized
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[22px] font-semibold text-brand-dark/50">
            {line.menuName.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-ink">
          {line.menuName}
        </h3>
        <p className="text-[13px] text-muted">
          {formatWon(line.unitPrice)} · {line.quantity}개
        </p>
        <p className="text-[15px] font-bold text-brand-dark">{formatWon(lineTotal)}</p>
      </div>
    </li>
  );
}

function CartSummary({
  cart,
  orderType,
}: {
  cart: CartResponse;
  orderType: CartOrderType;
}) {
  const subtotal = getCartSubtotal(cart.items);
  const deliveryFee =
    orderType === "delivery" ? (cart.deliveryFee ?? 0) : 0;
  const total = subtotal + deliveryFee;
  const minOrder = cart.minOrderPrice ?? 0;
  const meetsMinOrder = subtotal >= minOrder;

  return (
    <section className="mx-3 mb-4 mt-3 soft-card p-4">
      <div className="space-y-2 text-[14px]">
        <div className="flex justify-between text-muted">
          <span>메뉴 금액</span>
          <span>{formatWon(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>배달팁</span>
          <span>
            {orderType === "delivery"
              ? deliveryFee === 0
                ? "무료"
                : formatWon(deliveryFee)
              : "픽업 시 0원"}
          </span>
        </div>
        <div className="flex justify-between border-t border-line/80 pt-3 text-[16px] font-bold text-ink">
          <span>결제 예정 금액</span>
          <span className="text-brand-dark">{formatWon(total)}</span>
        </div>
      </div>

      {!meetsMinOrder && minOrder > 0 && (
        <p className="mt-3 rounded-2xl bg-accent-warm px-3 py-2.5 text-[13px] text-accent-warm-text">
          최소주문금액 {formatWon(minOrder)}까지{" "}
          <span className="font-semibold">
            {formatWon(minOrder - subtotal)}
          </span>{" "}
          더 담아주세요.
        </p>
      )}
    </section>
  );
}

function CartStoreHeader({ cart }: { cart: CartResponse }) {
  const storeId = cart.storeId;
  const storeName = cart.storeName?.trim() ?? "매장";
  const imageUrl = cart.storeImageUrl?.trim();
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;

  const content = (
    <div className="flex items-center gap-2.5 px-4 py-3.5">
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-brand-soft ring-1 ring-inset ring-brand/10">
        {showImage ? (
          <Image
            src={imageUrl!}
            alt=""
            fill
            className="object-cover"
            sizes="36px"
            unoptimized
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[14px] font-bold text-brand-dark">
            {storeName.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-1">
        <span className="truncate text-[15px] font-bold text-ink">
          {storeName}
        </span>
        {storeId != null && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="shrink-0 text-ink"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        )}
      </div>
    </div>
  );

  if (storeId == null) {
    return (
      <div className="border-b border-line/60">{content}</div>
    );
  }

  return (
    <Link
      href={`/stores/${storeId}`}
      aria-label={`${storeName} 매장으로 이동`}
      className="block border-b border-line/60 transition-colors hover:bg-surface/60 active:bg-surface"
    >
      {content}
    </Link>
  );
}

function CartSkeleton() {
  return (
    <div className="flex flex-1 flex-col bg-surface px-4 py-6">
      <div className="animate-pulse">
        <div className="mx-3 mt-3 overflow-hidden soft-card">
          <div className="mb-6 flex gap-2.5 border-b border-line/60 px-4 py-3.5">
            <div className="h-9 w-9 rounded-full bg-surface" />
            <div className="h-4 w-2/5 rounded-full bg-surface py-2.5" />
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="mb-4 flex gap-3.5 px-4">
            <div className="h-[72px] w-[72px] rounded-2xl bg-surface" />
            <div className="flex flex-1 flex-col gap-2 py-2">
              <div className="h-4 w-3/5 rounded-full bg-surface" />
              <div className="h-3 w-1/2 rounded-full bg-surface" />
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description, action }: {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-[28px]">
        {icon}
      </span>
      <div>
        <p className="text-[16px] font-bold text-ink">{title}</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function CartPageContent() {
  const { cart, loading, error, reload } = useCart();
  const [orderType, setOrderType] = useState<CartOrderType>("delivery");

  if (loading) {
    return <CartSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        icon="!"
        title="불러오지 못했어요"
        description={error}
        action={
          <PrimaryButton
            type="button"
            variant="outline"
            className="max-w-[200px]"
            onClick={() => void reload()}
          >
            다시 시도
          </PrimaryButton>
        }
      />
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="장바구니가 비어 있어요"
        description="맛있는 메뉴를 담으러 가볼까요?"
        action={
          <Link href="/main" className="brand-cta h-11 max-w-[200px] px-6">
            메뉴 보러가기
          </Link>
        }
      />
    );
  }

  const subtotal = getCartSubtotal(cart.items);
  const deliveryFee =
    orderType === "delivery" ? (cart.deliveryFee ?? 0) : 0;
  const total = subtotal + deliveryFee;
  const minOrder = cart.minOrderPrice ?? 0;
  const meetsMinOrder = minOrder === 0 || subtotal >= minOrder;
  const shortOfMin =
    minOrder > 0 && subtotal < minOrder ? minOrder - subtotal : 0;
  const itemCount = cart.items.reduce(
    (sum, line) => sum + line.quantity,
    0
  );

  return (
    <div className="relative flex flex-1 flex-col bg-surface">
      <div className="flex flex-1 flex-col bg-surface pb-[148px]">
        <div className="mx-3 mt-3 overflow-hidden soft-card">
          <CartStoreHeader cart={cart} />
          <ul className="px-4">
            {cart.items.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </ul>
        </div>
        <CartOrderTypeToggle
          orderType={orderType}
          onChange={setOrderType}
        />
        <CartSummary cart={cart} orderType={orderType} />
      </div>

      <CartCheckoutBar
        total={total}
        itemCount={itemCount}
        disabled={!meetsMinOrder}
        shortOfMin={shortOfMin}
      />
    </div>
  );
}
