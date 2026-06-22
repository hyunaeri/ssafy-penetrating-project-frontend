import { OrderTrackingMapPlaceholder } from "@/features/order-tracking/ui/OrderTrackingMapPlaceholder";

export function OrderTrackingLoadingScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#dfe6ee]">
      <OrderTrackingMapPlaceholder message={null} />
      <div className="absolute inset-x-0 bottom-0 z-30 rounded-t-[1.75rem] bg-white px-5 py-8 shadow-[0_-12px_40px_rgba(43,45,66,0.14)]">
        <div className="flex justify-center pb-4">
          <span className="h-1 w-10 rounded-full bg-line" />
        </div>
        <p className="text-center text-[14px] text-muted">주문 정보를 불러오는 중입니다</p>
      </div>
    </div>
  );
}
