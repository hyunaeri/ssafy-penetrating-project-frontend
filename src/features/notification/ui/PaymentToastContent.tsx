import { PaymentToastIcon } from "@/features/notification/ui/PaymentToastIcon";

type PaymentToastContentProps = {
  storeName: string;
  menuSummary: string;
};

export function PaymentToastContent({
  storeName,
  menuSummary,
}: PaymentToastContentProps) {
  return (
    <>
      <PaymentToastIcon size="sm" />
      <div className="min-w-0 flex-1 font-normal">
        <p className="truncate text-[13px] font-medium leading-snug text-ink/90">
          {storeName}
        </p>
        <p className="mt-1 line-clamp-2 text-[11px] font-normal leading-[1.45] text-muted/75">
          <span className="break-words">{menuSummary}</span>
          <span className="text-muted/75"> 결제가 완료되었습니다.</span>
        </p>
      </div>
    </>
  );
}
