"use client";

import { useStoreDetail } from "@/features/store-detail/hooks/use-store-detail";
import { DeliverySection } from "@/features/store-detail/ui/DeliverySection";
import { MenuList } from "@/features/store-detail/ui/MenuList";
import { StoreHero } from "@/features/store-detail/ui/StoreHero";
import { StoreInfoSection } from "@/features/store-detail/ui/StoreInfoSection";
import { PrimaryButton } from "@/shared/ui";

type StoreDetailScreenProps = {
  storeId: number;
};

function StoreDetailSkeleton() {
  return (
    <div className="animate-pulse bg-white">
      <div className="h-[220px] bg-surface" />
      <div className="space-y-3 px-4 py-4">
        <div className="h-7 w-2/3 rounded-sm bg-surface" />
        <div className="h-4 w-full rounded-sm bg-surface" />
        <div className="h-4 w-1/3 rounded-sm bg-surface" />
      </div>
      <div className="mx-4 h-32 rounded-2xl bg-surface" />
      <div className="mt-6 space-y-4 px-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3.5">
            <div className="h-[100px] w-[100px] rounded-xl bg-surface" />
            <div className="flex flex-1 flex-col gap-2 py-2">
              <div className="h-4 w-3/5 rounded-sm bg-surface" />
              <div className="h-3 w-full rounded-sm bg-surface" />
              <div className="h-4 w-1/4 rounded-sm bg-surface" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StoreDetailScreen({ storeId }: StoreDetailScreenProps) {
  const { store, loading, error, reload } = useStoreDetail(storeId);

  if (loading) {
    return <StoreDetailSkeleton />;
  }

  if (error || !store) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-white px-4 py-16 text-center">
        <p className="text-[14px] text-red-600">
          {error ?? "매장 정보를 불러오지 못했습니다."}
        </p>
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

  return (
    <div className="min-h-full bg-[#f5f5f5] pb-8">
      <StoreHero name={store.name} imageUrl={store.imageUrl} />
      <StoreInfoSection
        name={store.name}
        description={store.description}
        address={store.address}
      />
      <DeliverySection
        minOrderPrice={store.minOrderPrice}
        deliveryFee={store.deliveryFee}
      />
      <MenuList menus={store.menus} minOrderPrice={store.minOrderPrice} />
    </div>
  );
}
