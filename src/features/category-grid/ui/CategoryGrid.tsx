import { FOOD_CATEGORIES } from "@/entities/category";
import { CategoryCard } from "@/features/category-grid/ui/CategoryCard";

export function CategoryGrid() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="sticky top-0 z-10 border-b border-line bg-white px-5 pb-4 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
          Frontend For Development Test
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <h1 className="text-[22px] font-bold leading-none tracking-tight text-ink">
            배달 카테고리
          </h1>
          <p className="pb-0.5 text-[11px] font-medium text-muted">배달 · 포장</p>
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
