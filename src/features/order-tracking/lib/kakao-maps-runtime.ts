export type LatLngLiteral = {
  lat: number;
  lng: number;
};

export type KakaoMapsSdk = KakaoMapsNamespace;

export function getKakaoMapsSdk(): KakaoMapsSdk {
  const root = (window as Window & { kakao?: KakaoNamespace }).kakao;

  if (!root?.maps) {
    throw new Error("Kakao Maps SDK가 로드되지 않았습니다.");
  }

  return root.maps;
}
