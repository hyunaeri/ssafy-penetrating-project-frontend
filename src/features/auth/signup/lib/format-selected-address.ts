import type { Address } from "react-daum-postcode";

/** Daum 주소 검색 결과를 폼에 넣을 문자열로 변환한다 (우편번호 제외). */
export function formatSelectedAddress(data: Address): string {
  const base =
    data.userSelectedType === "R"
      ? data.roadAddress
      : data.jibunAddress || data.address;

  let extra = "";
  if (data.addressType === "R") {
    if (data.bname) extra = data.bname;
    if (data.buildingName) {
      extra = extra ? `${extra}, ${data.buildingName}` : data.buildingName;
    }
  }

  return extra ? `${base} (${extra})` : base;
}
