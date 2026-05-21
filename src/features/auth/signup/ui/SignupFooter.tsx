import { PrimaryButton } from "@/shared/ui";

type SignupFooterProps = {
  error: string | null;
  canSubmit: boolean;
  submitting: boolean;
  onSubmit: () => void;
};

export function SignupFooter({
  error,
  canSubmit,
  submitting,
  onSubmit,
}: SignupFooterProps) {
  return (
    <>
      {error && (
        <p className="mb-3 text-center text-[12px] text-red-600">{error}</p>
      )}
      <PrimaryButton type="button" disabled={!canSubmit} onClick={onSubmit}>
        {submitting ? "가입 처리 중…" : "가입 완료하고 시작하기"}
      </PrimaryButton>
    </>
  );
}
