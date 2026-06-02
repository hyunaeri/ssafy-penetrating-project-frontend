import { Suspense } from "react";
import { PaymentFailContent } from "@/features/payment";
import { BackHeader } from "@/shared/ui";

export default function PaymentFailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <BackHeader title="결제 실패" />
      <Suspense
        fallback={
          <p className="px-4 py-16 text-center text-[14px] text-muted">
            불러오는 중입니다
          </p>
        }
      >
        <PaymentFailContent />
      </Suspense>
    </div>
  );
}
