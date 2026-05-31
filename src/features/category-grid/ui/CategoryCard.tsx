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
      className="group relative block h-[166px] w-full overflow-hidden rounded-[1.35rem] border border-white bg-white text-left shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(42,193,188,0.15)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <span className="absolute left-3.5 top-3 z-[1] text-[16px] font-bold leading-snug tracking-tight text-ink">
        {category.name}
      </span>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-soft/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="pointer-events-none absolute -bottom-4 -right-2 z-0 h-[156px] w-[172px]">
        <Image
          src={category.imageUrl}
          alt=""
          width={172}
          height={156}
          className="h-full w-full object-contain object-bottom-right transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
