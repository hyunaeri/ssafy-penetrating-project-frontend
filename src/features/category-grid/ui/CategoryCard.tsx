import Image from "next/image";
import Link from "next/link";
import { getCategoryPath, type FoodCategory } from "@/entities/category";

type CategoryCardProps = {
  category: FoodCategory;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={getCategoryPath(category.id)}
      className="relative block h-[166px] w-full overflow-hidden rounded-2xl border border-ink/15 bg-white text-left shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-ink/30 hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_4px_14px_rgba(0,0,0,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <span className="absolute left-3.5 top-3 z-[1] text-[16px] font-bold leading-snug tracking-tight text-ink">
        {category.name}
      </span>

      <div className="pointer-events-none absolute -bottom-4 -right-2 z-0 h-[156px] w-[172px]">
        <Image
          src={category.imageUrl}
          alt=""
          width={172}
          height={156}
          className="h-full w-full object-contain object-bottom-right"
        />
      </div>
    </Link>
  );
}
