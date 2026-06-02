/** Toss 결제창에서 사용자가 취소·닫기한 경우 */
export function isPaymentUserCancel(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: string }).code === "string"
      ? (error as { code: string }).code
      : "";

  if (code === "PAY_PROCESS_CANCELED" || code === "USER_CANCEL") {
    return true;
  }

  return /취소|cancel/i.test(error.message);
}
