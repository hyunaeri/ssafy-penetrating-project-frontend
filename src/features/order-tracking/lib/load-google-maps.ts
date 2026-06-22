import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let loadPromise: Promise<void> | undefined;

export function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Google Maps는 클라이언트에서만 사용할 수 있습니다.")
    );
  }

  if (loadPromise) {
    return loadPromise;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (!apiKey) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY가 설정되지 않았습니다.")
    );
  }

  setOptions({
    key: apiKey,
    v: "weekly",
    language: "ko",
    region: "KR",
  });

  loadPromise = Promise.all([
    importLibrary("maps"),
    importLibrary("geocoding"),
    importLibrary("routes"),
  ]).then(() => undefined);

  return loadPromise;
}

export function getGoogleMapsMapId(): string | undefined {
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim();
  return mapId || undefined;
}
