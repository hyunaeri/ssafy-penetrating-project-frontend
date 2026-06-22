"use client";

import Link from "next/link";
import { CartEntryButton } from "@/features/cart";
import { StoreCard } from "@/features/category-stores/ui/StoreCard";
import { useFavorites } from "@/features/favorite/hooks/use-favorites";
import { AlarmButton } from "@/features/notification";
import { BackHeader, PrimaryButton } from "@/shared/ui";

export function FavoriteStoresScreen() {
  const { stores, loading, error, reload } = useFavorites();
  const showList = !loading && !error && stores.length > 0;
  const isEmpty = !loading && !error && stores.length === 0;

  return (
    <div className="screen-viewport flex flex-col bg-surface">
      <BackHeader
        title="찜"
        trailing={
          <>
            <AlarmButton />
            <CartEntryButton />
          </>
        }
      />

      {showList && (
        <p className="border-b border-line/80 bg-white px-4 py-2.5 text-[13px] text-muted">
          <span className="font-semibold text-brand-dark">{stores.length}</span>
          개 매장
        </p>
      )}

      <div className="screen-body">
        {loading && (
          <div className="screen-state items-stretch justify-start px-4 py-6 text-left">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse gap-3.5 border-b border-line py-4"
              >
                <div className="h-[88px] w-[88px] shrink-0 rounded-2xl bg-white" />
                <div className="flex flex-1 flex-col justify-center gap-2 py-1">
                  <div className="h-4 w-3/5 rounded-sm bg-surface" />
                  <div className="h-3 w-full rounded-sm bg-surface" />
                  <div className="h-3 w-2/5 rounded-sm bg-surface" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="screen-state gap-4">
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
        )}

        {isEmpty && (
          <div className="screen-state gap-4">
            <span className="text-[40px]" aria-hidden>
              ♡
            </span>
            <div>
              <p className="text-[16px] font-bold text-ink">
                찜한 매장이 없어요
              </p>
              <p className="mt-2 text-[14px] text-muted">
                매장 상세에서 하트를 눌러 찜해 보세요.
              </p>
            </div>
            <Link href="/main" className="brand-cta h-11 max-w-[200px] px-6">
              매장 둘러보기
            </Link>
          </div>
        )}

        {showList && (
          <ul className="divide-y divide-line/80 bg-white px-3">
            {stores.map((store) => (
              <li key={store.id}>
                <StoreCard store={store} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
