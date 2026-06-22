declare global {
  interface Window {
    kakao?: KakaoNamespace;
  }

  interface KakaoNamespace {
    maps: KakaoMapsNamespace;
  }

  interface KakaoMapsNamespace {
    load(callback: () => void): void;
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    LatLngBounds: new (sw: KakaoLatLng, ne: KakaoLatLng) => KakaoLatLngBounds;
    Map: new (
      container: HTMLElement,
      options: {
        center: KakaoLatLng;
        level: number;
        draggable?: boolean;
        scrollwheel?: boolean;
      }
    ) => KakaoMap;
    Marker: new (options: {
      map?: KakaoMap;
      position: KakaoLatLng;
      title?: string;
      image?: KakaoMarkerImage;
      zIndex?: number;
    }) => KakaoMarker;
    MarkerImage: new (
      src: string,
      size: KakaoSize,
      options?: { offset?: KakaoPoint }
    ) => KakaoMarkerImage;
    Size: new (width: number, height: number) => KakaoSize;
    Point: new (x: number, y: number) => KakaoPoint;
    Polyline: new (options: {
      map?: KakaoMap;
      path: KakaoLatLng[];
      strokeWeight?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeStyle?: string;
      zIndex?: number;
    }) => KakaoPolyline;
    services: {
      Geocoder: new () => KakaoGeocoder;
      Status: {
        OK: string;
      };
    };
  }

  interface KakaoLatLng {
    getLat(): number;
    getLng(): number;
  }

  interface KakaoLatLngBounds {
    extend(latLng: KakaoLatLng): void;
  }

  interface KakaoMap {
    setBounds(bounds: KakaoLatLngBounds): void;
  }

  interface KakaoMarker {
    setMap(map: KakaoMap | null): void;
  }

  interface KakaoMarkerImage {
    readonly __brand?: never;
  }

  interface KakaoSize {
    readonly __brand?: never;
  }

  interface KakaoPoint {
    readonly __brand?: never;
  }

  interface KakaoPolyline {
    setMap(map: KakaoMap | null): void;
  }

  interface KakaoGeocoder {
    addressSearch(
      address: string,
      callback: (
        result: Array<{ x: string; y: string }>,
        status: string
      ) => void
    ): void;
  }
}

export {};
