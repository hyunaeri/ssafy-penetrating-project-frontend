import { notFound } from "next/navigation";
import { findFoodCategoryById } from "@/entities/category";
import { CategoryStoresScreen } from "@/features/category-stores";

type CategoryPageProps = {
  params: Promise<{ categoryId: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const id = Number(categoryId);

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  const category = findFoodCategoryById(id);
  if (!category) {
    notFound();
  }

  return <CategoryStoresScreen category={category} />;
}
