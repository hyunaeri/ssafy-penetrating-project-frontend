"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadKakaoMaps } from "@/features/order-tracking/lib/load-kakao-maps";
import { getKakaoMapsSdk } from "@/features/order-tracking/lib/kakao-maps-runtime";
import {
  createMapMarkerImage,
  drawNeonRoute,
  fetchRoadRoute,
  fitMapToLocations,
  geocodeAddress,
  toKakaoLatLng,
  type LatLngLiteral,
} from "@/features/order-tracking/lib/order-tracking-map-helpers";
import { OrderTrackingMapLegend } from "@/features/order-tracking/ui/OrderTrackingMapLegend";
import { OrderTrackingMapPlaceholder } from "@/features/order-tracking/ui/OrderTrackingMapPlaceholder";
import { OrderTrackingMapRecenterButton } from "@/features/order-tracking/ui/OrderTrackingMapRecenterButton";

type OrderTrackingMapProps = {
  userAddress: string | null;
  storeAddress: string | null;
};

export function OrderTrackingMap({
  userAddress,
  storeAddress,
}: OrderTrackingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const fitLocationsRef = useRef<LatLngLiteral[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecenter = useCallback(() => {
    if (!mapRef.current || fitLocationsRef.current.length === 0) {
      return;
    }

    fitMapToLocations(mapRef.current, fitLocationsRef.current);
  }, []);

  const trimmedUserAddress = userAddress?.trim() ?? "";
  const trimmedStoreAddress = storeAddress?.trim() ?? "";
  const hasAddresses = Boolean(trimmedUserAddress && trimmedStoreAddress);

  useEffect(() => {
    if (!hasAddresses || !containerRef.current) {
      return;
    }

    let cancelled = false;
    const markers: KakaoMarker[] = [];
    const polylines: KakaoPolyline[] = [];

    const init = async () => {
      try {
        await loadKakaoMaps();
        if (cancelled || !containerRef.current) {
          return;
        }

        const [userLocation, storeLocation] = await Promise.all([
          geocodeAddress(trimmedUserAddress),
          geocodeAddress(trimmedStoreAddress),
        ]);

        if (cancelled || !containerRef.current) {
          return;
        }

        const maps = getKakaoMapsSdk();
        const center = toKakaoLatLng({
          lat: (userLocation.lat + storeLocation.lat) / 2,
          lng: (userLocation.lng + storeLocation.lng) / 2,
        });

        const map = new maps.Map(containerRef.current, {
          center,
          level: 5,
          draggable: true,
          scrollwheel: true,
        });

        markers.push(
          new maps.Marker({
            map,
            position: toKakaoLatLng(storeLocation),
            title: "매장",
            image: createMapMarkerImage("store"),
            zIndex: 3,
          }),
          new maps.Marker({
            map,
            position: toKakaoLatLng(userLocation),
            title: "배달 주소",
            image: createMapMarkerImage("user"),
            zIndex: 4,
          })
        );

        let routePath: LatLngLiteral[];
        try {
          routePath = await fetchRoadRoute(storeLocation, userLocation);
        } catch {
          routePath = [storeLocation, userLocation];
        }

        if (cancelled) {
          return;
        }

        const fitLocations = [...routePath, userLocation, storeLocation];
        fitLocationsRef.current = fitLocations;
        mapRef.current = map;
        fitMapToLocations(map, fitLocations);
        polylines.push(...drawNeonRoute(map, routePath));
        setReady(true);
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "지도를 불러오지 못했습니다.";
          setError(message);
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
      mapRef.current = null;
      fitLocationsRef.current = [];
      markers.forEach((marker) => marker.setMap(null));
      polylines.forEach((polyline) => polyline.setMap(null));
    };
  }, [hasAddresses, trimmedStoreAddress, trimmedUserAddress]);

  if (!hasAddresses) {
    return (
      <OrderTrackingMapPlaceholder message="주소 정보가 없어 지도를 표시할 수 없어요" />
    );
  }

  return (
    <div className="absolute inset-0">
      {!ready && !error && <OrderTrackingMapPlaceholder message={null} />}
      {error && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center bg-[#dfe6ee] px-6">
          <p className="rounded-full bg-white/85 px-4 py-2 text-center text-[12px] font-medium text-muted shadow-soft">
            {error}
          </p>
        </div>
      )}
      <div
        ref={containerRef}
        className={`absolute inset-0 transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        aria-label="배달 경로 지도"
      />
      {ready && !error && (
        <>
          <OrderTrackingMapLegend />
          <OrderTrackingMapRecenterButton onClick={handleRecenter} />
        </>
      )}
    </div>
  );
}
