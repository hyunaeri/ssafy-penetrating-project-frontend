export type LatLngLiteral = google.maps.LatLngLiteral;

const BRAND_COLOR = "#2ac1bc";
const BRAND_GLOW = "#7efcf6";

export function geocodeAddress(
  geocoder: google.maps.Geocoder,
  address: string
): Promise<LatLngLiteral> {
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address, region: "KR" }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
        return;
      }

      reject(new Error("주소를 지도에서 찾지 못했습니다."));
    });
  });
}

export function fetchDrivingRoute(
  directionsService: google.maps.DirectionsService,
  origin: LatLngLiteral,
  destination: LatLngLiteral
): Promise<google.maps.LatLng[]> {
  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result?.routes[0]) {
          resolve(result.routes[0].overview_path);
          return;
        }

        reject(new Error("배달 경로를 찾지 못했습니다."));
      }
    );
  });
}

export function createMapMarkerIcon(
  maps: typeof google.maps,
  variant: "user" | "store"
): google.maps.Icon {
  const fill = variant === "user" ? "#2b2d42" : BRAND_COLOR;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40" fill="none">
      <path d="M16 1C9.4 1 4 6.4 4 13c0 8.4 12 24 12 24s12-15.6 12-24C28 6.4 22.6 1 16 1Z" fill="${fill}" stroke="white" stroke-width="2.2"/>
      <circle cx="16" cy="13" r="4.5" fill="white" fill-opacity="0.95"/>
    </svg>
  `.trim();

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new maps.Size(32, 40),
    anchor: new maps.Point(16, 40),
  };
}

export function drawNeonRoute(
  map: google.maps.Map,
  path: google.maps.LatLng[]
): google.maps.Polyline[] {
  const glow = new google.maps.Polyline({
    path,
    map,
    strokeColor: BRAND_COLOR,
    strokeOpacity: 0.28,
    strokeWeight: 14,
    zIndex: 1,
  });

  const line = new google.maps.Polyline({
    path,
    map,
    strokeColor: BRAND_GLOW,
    strokeOpacity: 0.95,
    strokeWeight: 5,
    zIndex: 2,
  });

  return [glow, line];
}

export function fitMapToLocations(
  map: google.maps.Map,
  locations: LatLngLiteral[]
): void {
  const bounds = new google.maps.LatLngBounds();
  locations.forEach((location) => bounds.extend(location));
  map.fitBounds(bounds, { top: 88, bottom: 300, left: 36, right: 36 });
}
