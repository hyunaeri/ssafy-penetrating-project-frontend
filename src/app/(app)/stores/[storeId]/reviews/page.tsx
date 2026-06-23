import { notFound } from "next/navigation";
import { StoreReviewsScreen } from "@/features/review";

type StoreReviewsPageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function StoreReviewsPage({ params }: StoreReviewsPageProps) {
  const { storeId } = await params;
  const id = Number(storeId);

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  return <StoreReviewsScreen storeId={id} />;
}
