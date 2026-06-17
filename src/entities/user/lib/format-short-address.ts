/** 도/광역시 등 광역 단위 접미사 */
const PROVINCE_SUFFIX = /(특별자치도|특별자치시|특별시|광역시|도)$/;

/**
 * 저장된 전체 주소에서 헤더에 보여줄 간결한 지역 문자열을 만든다.
 *
 * 회원가입 시 주소는 `기본주소 (법정동, 건물명) 상세주소` 형태로 합쳐 저장된다.
 * - 괄호와 그 뒤 상세주소는 제거한다.
 * - 맨 앞 광역 단위(경상북도, 서울특별시 등)는 떼어내 시/구·동 위주로 보여준다.
 * - 너무 길어지지 않도록 앞쪽 3개 토큰까지만 사용한다.
 *
 * 합쳐진 문자열 특성상 일부 주소(괄호 없는 지번 등)에서는 정확히 분리되지 않을 수 있다.
 */

export function formatShortAddress(address: string | null | undefined): string {
  const trimmed = address?.trim();
  if (!trimmed) return '';

  const base = trimmed.includes('(') ? trimmed.slice(0, trimmed.indexOf('(')) : trimmed;

  const tokens = base.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return trimmed;

  if (tokens.length > 1 && PROVINCE_SUFFIX.test(tokens[0])) {
    tokens.shift();
  }

  return tokens.slice(0, 3).join(' ') || trimmed;
}
