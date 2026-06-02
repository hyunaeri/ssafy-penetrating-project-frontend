type TossAmount = {
  currency: string;
  value: number;
};

type TossPaymentRequest = {
  method: string;
  amount: TossAmount;
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
  customerEmail?: string;
  customerName?: string;
  card?: Record<string, unknown>;
  transfer?: Record<string, unknown>;
};

type TossPaymentInstance = {
  requestPayment: (request: TossPaymentRequest) => Promise<void>;
  requestBillingAuth?: (request: Record<string, unknown>) => Promise<void>;
};

type TossPaymentsFactory = {
  payment: (options: { customerKey: string }) => TossPaymentInstance;
  widgets?: (options: { customerKey: string }) => unknown;
  ANONYMOUS?: string;
};

interface Window {
  TossPayments?: (clientKey: string) => TossPaymentsFactory;
}
