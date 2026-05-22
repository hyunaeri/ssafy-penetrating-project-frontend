/** 검색 주소 + 선택 상세 주소를 서버용 단일 address 문자열로 합친다. */
export function formatSignupAddress(base: string, detail: string): string {
  const trimmedBase = base.trim();
  const trimmedDetail = detail.trim();
  if (!trimmedDetail) return trimmedBase;
  return `${trimmedBase} ${trimmedDetail}`;
}
