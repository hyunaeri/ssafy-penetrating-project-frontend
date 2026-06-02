import { PaymentCheckoutScreen } from "@/features/payment";
import { BackHeader } from "@/shared/ui";

export default function PaymentCheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <BackHeader title="결제하기" />
      <PaymentCheckoutScreen />
    </div>
  );
}
