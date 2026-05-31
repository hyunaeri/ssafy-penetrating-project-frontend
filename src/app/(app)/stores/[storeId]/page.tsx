import { notFound } from "next/navigation";
import { StoreDetailScreen } from "@/features/store-detail";

type StorePageProps = {
  params: Promise<{ storeId: string }>;
};

export default async function StorePage({ params }: StorePageProps) {
  const { storeId } = await params;
  const id = Number(storeId);

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  return <StoreDetailScreen storeId={id} />;
}
