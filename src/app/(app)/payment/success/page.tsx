import { Suspense } from "react";
import { PaymentSuccessContent } from "@/features/payment";
import { BackHeader } from "@/shared/ui";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <BackHeader title="결제 완료" />
      <Suspense
        fallback={
          <p className="px-4 py-16 text-center text-[14px] text-muted">
            결제 승인 처리 중입니다
          </p>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
