import { FOOD_CATEGORIES } from "@/entities/category/model/categories";
import type { StoreDetailResponse } from "@/entities/store/model/types";
import { formatWon } from "@/features/category-stores/lib/format-store-display";

type OwnerStoreInfoViewProps = {
  store: StoreDetailResponse;
};

export function OwnerStoreInfoView({ store }: OwnerStoreInfoViewProps) {
  const categoryName =
    FOOD_CATEGORIES.find((category) => category.id === store.categoryId)
      ?.name ?? "기타";

  return (
    <dl className="mt-4 space-y-3 text-[14px]">
      <div>
        <dt className="text-muted">카테고리</dt>
        <dd className="mt-0.5 font-semibold text-ink">{categoryName}</dd>
      </div>
      <div>
        <dt className="text-muted">매장명</dt>
        <dd className="mt-0.5 font-semibold text-ink">{store.name}</dd>
      </div>
      <div>
        <dt className="text-muted">주소</dt>
        <dd className="mt-0.5 text-ink">{store.address ?? "-"}</dd>
      </div>
      <div>
        <dt className="text-muted">설명</dt>
        <dd className="mt-0.5 text-ink">{store.description ?? "-"}</dd>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <dt className="text-muted">최소 주문금액</dt>
          <dd className="mt-0.5 font-semibold text-ink">
            {formatWon(store.minOrderPrice)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">배달비</dt>
          <dd className="mt-0.5 font-semibold text-ink">
            {formatWon(store.deliveryFee)}
          </dd>
        </div>
      </div>
    </dl>
  );
}
