import type { OrderResponse, OrderStatus } from "@/entities/order";
import { OwnerOrderCard } from "@/features/owner-orders/ui/OwnerOrderCard";

type OwnerOrdersListProps = {
  orders: OrderResponse[];
  updating?: boolean;
  onUpdateStatus: (orderId: number, status: OrderStatus) => Promise<void>;
};

export function OwnerOrdersList({
  orders,
  updating,
  onUpdateStatus,
}: OwnerOrdersListProps) {
  return (
    <ul className="flex flex-col gap-3 px-4 py-4">
      {orders.map((order) => (
        <li key={order.id}>
          <OwnerOrderCard
            order={order}
            updating={updating}
            onUpdateStatus={onUpdateStatus}
          />
        </li>
      ))}
    </ul>
  );
}
