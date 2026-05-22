import { FOOD_CATEGORIES } from "@/entities/category";
import { CartEntryButton } from "@/features/cart";
import { AlarmButton } from "@/features/notification";
import { CategoryCard } from "@/features/category-grid/ui/CategoryCard";

export function CategoryGrid() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="sticky top-0 z-20 border-b border-line bg-white px-5 pb-4 pt-5 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
          Frontend For Development Test
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <h1 className="text-[22px] font-bold leading-none tracking-tight text-ink">
            배달 카테고리
          </h1>
          <div className="flex shrink-0 items-center gap-0.5">
            <AlarmButton />
            <CartEntryButton />
          </div>
        </div>
      </header>
      <div className="grid flex-1 grid-cols-2 gap-3 px-4 pb-8 pt-4">
        {FOOD_CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
