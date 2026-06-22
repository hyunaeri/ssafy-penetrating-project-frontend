import { PaymentCheckoutScreen } from "@/features/payment";
import { BackHeader } from "@/shared/ui";

export default function PaymentCheckoutPage() {
  return (
    <div className="screen-viewport flex flex-col bg-surface">
      <BackHeader title="결제하기" />
      <div className="screen-body">
        <PaymentCheckoutScreen />
      </div>
    </div>
  );
}
