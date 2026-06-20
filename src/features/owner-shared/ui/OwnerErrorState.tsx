import { PrimaryButton } from "@/shared/ui";

type OwnerErrorStateProps = {
  message: string;
  onRetry: () => void;
  className?: string;
};

export function OwnerErrorState({
  message,
  onRetry,
  className = "",
}: OwnerErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center gap-4 text-center ${className}`}
    >
      <p className="text-[14px] text-red-600">{message}</p>
      <PrimaryButton
        type="button"
        variant="outline"
        className="max-w-[200px]"
        onClick={onRetry}
      >
        다시 시도
      </PrimaryButton>
    </div>
  );
}
