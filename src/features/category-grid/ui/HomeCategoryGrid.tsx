import Image from "next/image";
import Link from "next/link";
import { FOOD_CATEGORIES, getCategoryPath } from "@/entities/category";

type HomeCategoryGridProps = {
  query: string;
};

export function HomeCategoryGrid({ query }: HomeCategoryGridProps) {
  const trimmed = query.trim().toLowerCase();
  const categories = trimmed
    ? FOOD_CATEGORIES.filter((category) =>
        category.name.toLowerCase().includes(trimmed)
      )
    : FOOD_CATEGORIES;

  return (
    <section className="rounded-card bg-white px-3 py-4 shadow-card">
      {!trimmed && (
        <h2 className="px-1 pb-3 text-[16px] font-bold tracking-tight text-ink">
          무엇을 주문할까요?
        </h2>
      )}

      {categories.length === 0 ? (
        <p className="px-1 py-8 text-center text-[14px] text-muted">
          ‘{query.trim()}’ 카테고리를 찾지 못했어요.
        </p>
      ) : (
        <ul className="grid grid-cols-4 gap-x-3 gap-y-6">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={getCategoryPath(category.id)}
                className="group flex flex-col items-center gap-2"
              >
                <span className="relative flex aspect-square w-[78%] items-center justify-center overflow-hidden rounded-2xl bg-[#fdf7ee] ring-1 ring-inset ring-line/70 transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_10px_22px_rgba(42,193,188,0.22)] group-hover:ring-brand/40 group-active:translate-y-0 group-active:scale-95">
                  <Image
                    src={category.imageUrl}
                    alt=""
                    fill
                    sizes="72px"
                    quality={100}
                    className="object-cover transition-transform duration-200 ease-out group-hover:scale-110"
                  />
                </span>
                <span className="line-clamp-1 text-center text-[12.5px] font-medium text-ink transition-colors group-hover:text-brand-dark">
                  {category.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
