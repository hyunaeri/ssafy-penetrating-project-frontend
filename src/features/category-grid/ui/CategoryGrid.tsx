import { FOOD_CATEGORIES } from "@/entities/category";
import { CartEntryButton } from "@/features/cart";
import { AlarmButton } from "@/features/notification";
import { CategoryCard } from "@/features/category-grid/ui/CategoryCard";

export function CategoryGrid() {
  return (
    <div className="flex min-h-full flex-col bg-surface">
      <header className="sticky top-0 z-20 bg-white/95 px-5 pb-4 pt-5 shadow-[0_4px_20px_rgba(43,45,66,0.04)] backdrop-blur-sm">
        <p className="inline-flex rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-semibold tracking-wide text-brand-dark">
          YumYumCoach
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold leading-tight tracking-tight text-ink">
              배달 카테고리
            </h1>
            <p className="mt-1 text-[13px] text-muted">오늘은 뭐 먹을까요?</p>
          </div>
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
