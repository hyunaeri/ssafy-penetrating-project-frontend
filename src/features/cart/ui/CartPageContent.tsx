"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  getCartLineTotal,
  getCartSubtotal,
  type CartLineResponse,
  type CartResponse,
} from "@/entities/cart";
import { useCart } from "@/features/cart/hooks/use-cart";
import { formatWon } from "@/features/category-stores/lib/format-store-display";
import { PrimaryButton } from "@/shared/ui";

function CartLineItem({ line }: { line: CartLineResponse }) {
  const imageUrl = line.menuImageUrl?.trim();
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;
  const lineTotal = getCartLineTotal(line);

  return (
    <li className="flex gap-3.5 border-b border-line py-4 last:border-b-0">
      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-inset ring-ink/8">
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
          <span className="flex h-full w-full items-center justify-center text-[22px] font-semibold text-muted/70">
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
        <p className="text-[15px] font-bold text-ink">{formatWon(lineTotal)}</p>
      </div>
    </li>
  );
}

function CartSummary({ cart }: { cart: CartResponse }) {
  const subtotal = getCartSubtotal(cart.items);
  const deliveryFee = cart.deliveryFee ?? 0;
  const total = subtotal + deliveryFee;
  const minOrder = cart.minOrderPrice ?? 0;
  const meetsMinOrder = subtotal >= minOrder;

  return (
    <section className="border-t border-line bg-white px-4 py-4">
      <div className="space-y-2 text-[14px]">
        <div className="flex justify-between text-muted">
          <span>메뉴 금액</span>
          <span>{formatWon(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>배달팁</span>
          <span>{deliveryFee === 0 ? "무료" : formatWon(deliveryFee)}</span>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-[16px] font-bold text-ink">
          <span>결제 예정 금액</span>
          <span>{formatWon(total)}</span>
        </div>
      </div>

      {!meetsMinOrder && minOrder > 0 && (
        <p className="mt-3 rounded-lg bg-[#fff8e6] px-3 py-2.5 text-[13px] text-[#9a6700]">
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
    <div className="flex items-center gap-3 px-4 py-4">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-inset ring-ink/8">
        {showImage ? (
          <Image
            src={imageUrl!}
            alt=""
            fill
            className="object-cover"
            sizes="48px"
            unoptimized
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[16px] font-bold text-muted">
            {storeName.charAt(0)}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-bold text-ink">{storeName}</p>
        {typeof cart.minOrderPrice === "number" && (
          <p className="mt-0.5 text-[13px] text-muted">
            최소주문 {formatWon(cart.minOrderPrice)}
          </p>
        )}
      </div>
      {storeId != null && (
        <span className="shrink-0 text-[13px] font-medium text-muted">›</span>
      )}
    </div>
  );

  if (storeId == null) {
    return <div className="border-b border-line bg-white">{content}</div>;
  }

  return (
    <Link
      href={`/stores/${storeId}`}
      className="block border-b border-line bg-white transition-colors hover:bg-surface/50"
    >
      {content}
    </Link>
  );
}

function CartSkeleton() {
  return (
    <div className="animate-pulse px-4 py-6">
      <div className="mb-6 flex gap-3">
        <div className="h-12 w-12 rounded-xl bg-surface" />
        <div className="flex flex-1 flex-col gap-2 py-1">
          <div className="h-4 w-2/5 rounded-sm bg-surface" />
          <div className="h-3 w-1/3 rounded-sm bg-surface" />
        </div>
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="mb-4 flex gap-3.5">
          <div className="h-[72px] w-[72px] rounded-xl bg-surface" />
          <div className="flex flex-1 flex-col gap-2 py-2">
            <div className="h-4 w-3/5 rounded-sm bg-surface" />
            <div className="h-3 w-1/2 rounded-sm bg-surface" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartPageContent() {
  const { cart, loading, error, reload } = useCart();

  if (loading) {
    return <CartSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="text-[14px] text-red-600">{error}</p>
        <PrimaryButton
          type="button"
          variant="outline"
          className="max-w-[200px]"
          onClick={() => void reload()}
        >
          다시 시도
        </PrimaryButton>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="text-[15px] font-medium text-ink">장바구니가 비어 있어요</p>
        <p className="text-[14px] text-muted">
          맛있는 메뉴를 담으러 가볼까요?
        </p>
        <Link
          href="/main"
          className="inline-flex h-11 max-w-[200px] w-full items-center justify-center rounded-lg bg-ink px-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          메뉴 보러가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#f5f5f5]">
      <CartStoreHeader cart={cart} />
      <ul className="bg-white px-4">
        {cart.items.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </ul>
      <CartSummary cart={cart} />
    </div>
  );
}
