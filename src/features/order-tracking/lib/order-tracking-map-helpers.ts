import { getKakaoMapsSdk } from "@/features/order-tracking/lib/kakao-maps-runtime";

export type LatLngLiteral = {
  lat: number;
  lng: number;
};

const BRAND_COLOR = "#2ac1bc";
const BRAND_GLOW = "#7efcf6";

export function geocodeAddress(address: string): Promise<LatLngLiteral> {
  return new Promise((resolve, reject) => {
    const maps = getKakaoMapsSdk();
    const geocoder = new maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status !== maps.services.Status.OK || !result[0]) {
        reject(new Error("주소를 지도에서 찾지 못했습니다."));
        return;
      }

      resolve({
        lat: Number(result[0].y),
        lng: Number(result[0].x),
      });
    });
  });
}

export async function fetchRoadRoute(
  origin: LatLngLiteral,
  destination: LatLngLiteral
): Promise<LatLngLiteral[]> {
  const params = new URLSearchParams({
    originLat: String(origin.lat),
    originLng: String(origin.lng),
    destLat: String(destination.lat),
    destLng: String(destination.lng),
  });

  const response = await fetch(`/api/route/directions?${params.toString()}`, {
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as {
    path?: LatLngLiteral[];
    message?: string;
  };

  if (!response.ok || !data.path?.length) {
    throw new Error(data.message ?? "배달 경로를 찾지 못했습니다.");
  }

  return data.path;
}

export function toKakaoLatLng({ lat, lng }: LatLngLiteral): KakaoLatLng {
  const maps = getKakaoMapsSdk();
  return new maps.LatLng(lat, lng);
}

export function createMapMarkerImage(variant: "user" | "store"): KakaoMarkerImage {
  const maps = getKakaoMapsSdk();
  const fill = variant === "user" ? "#2b2d42" : BRAND_COLOR;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40" fill="none">
      <path d="M16 1C9.4 1 4 6.4 4 13c0 8.4 12 24 12 24s12-15.6 12-24C28 6.4 22.6 1 16 1Z" fill="${fill}" stroke="white" stroke-width="2.2"/>
      <circle cx="16" cy="13" r="4.5" fill="white" fill-opacity="0.95"/>
    </svg>
  `.trim();

  return new maps.MarkerImage(
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    new maps.Size(32, 40),
    { offset: new maps.Point(16, 40) }
  );
}

export function drawNeonRoute(
  map: KakaoMap,
  path: LatLngLiteral[]
): KakaoPolyline[] {
  const maps = getKakaoMapsSdk();
  const kakaoPath = path.map(toKakaoLatLng);

  const glow = new maps.Polyline({
    path: kakaoPath,
    map,
    strokeColor: BRAND_COLOR,
    strokeOpacity: 0.28,
    strokeWeight: 14,
    strokeStyle: "solid",
    zIndex: 1,
  });

  const line = new maps.Polyline({
    path: kakaoPath,
    map,
    strokeColor: BRAND_GLOW,
    strokeOpacity: 0.95,
    strokeWeight: 5,
    strokeStyle: "solid",
    zIndex: 2,
  });

  return [glow, line];
}

export function fitMapToLocations(
  map: KakaoMap,
  locations: LatLngLiteral[]
): void {
  if (locations.length === 0) {
    return;
  }

  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  let minLng = Number.POSITIVE_INFINITY;
  let maxLng = Number.NEGATIVE_INFINITY;

  locations.forEach(({ lat, lng }) => {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  const latPadding = (maxLat - minLat) * 0.18 || 0.002;
  const lngPadding = (maxLng - minLng) * 0.18 || 0.002;

  const maps = getKakaoMapsSdk();
  const bounds = new maps.LatLngBounds(
    new maps.LatLng(minLat - latPadding, minLng - lngPadding),
    new maps.LatLng(maxLat + latPadding, maxLng + lngPadding)
  );

  map.setBounds(bounds);
}
