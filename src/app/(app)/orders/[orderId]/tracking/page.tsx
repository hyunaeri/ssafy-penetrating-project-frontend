import { OrderTrackingByIdScreen } from "@/features/order-tracking";

type OrderTrackingPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { orderId } = await params;
  const parsedOrderId = Number(orderId);

  if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-[14px] text-muted">올바르지 않은 주문입니다.</p>
      </div>
    );
  }

  return <OrderTrackingByIdScreen orderId={parsedOrderId} />;
}
