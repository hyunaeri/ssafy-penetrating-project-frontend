import { Suspense } from "react";
import { PaymentSuccessContent } from "@/features/payment";
import { OrderTrackingLoadingScreen } from "@/features/order-tracking";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<OrderTrackingLoadingScreen />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
