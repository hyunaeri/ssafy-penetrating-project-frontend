import { CartPageContent } from "@/features/cart";
import { BackHeader } from "@/shared/ui";

export default function CartPage() {
  return (
    <div className="flex min-h-full flex-col bg-surface">
      <BackHeader title="장바구니" />
      <CartPageContent />
    </div>
  );
}
