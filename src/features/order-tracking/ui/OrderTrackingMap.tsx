"use client";

import { useEffect, useRef, useState } from "react";
import { getGoogleMapsMapId, loadGoogleMaps } from "@/features/order-tracking/lib/load-google-maps";
import {
  createMapMarkerIcon,
  drawNeonRoute,
  fetchRoadRoute,
  fitMapToLocations,
  geocodeAddress,
} from "@/features/order-tracking/lib/order-tracking-map-helpers";
import { OrderTrackingMapLegend } from "@/features/order-tracking/ui/OrderTrackingMapLegend";
import { OrderTrackingMapPlaceholder } from "@/features/order-tracking/ui/OrderTrackingMapPlaceholder";

type OrderTrackingMapProps = {
  userAddress: string | null;
  storeAddress: string | null;
};

export function OrderTrackingMap({
  userAddress,
  storeAddress,
}: OrderTrackingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedUserAddress = userAddress?.trim() ?? "";
  const trimmedStoreAddress = storeAddress?.trim() ?? "";
  const hasAddresses = Boolean(trimmedUserAddress && trimmedStoreAddress);

  useEffect(() => {
    if (!hasAddresses || !containerRef.current) {
      return;
    }

    let cancelled = false;
    const markers: google.maps.Marker[] = [];
    const polylines: google.maps.Polyline[] = [];

    const init = async () => {
      try {
        await loadGoogleMaps();
        if (cancelled || !containerRef.current) {
          return;
        }

        const geocoder = new google.maps.Geocoder();
        const directionsService = new google.maps.DirectionsService();

        const [userLocation, storeLocation] = await Promise.all([
          geocodeAddress(geocoder, trimmedUserAddress),
          geocodeAddress(geocoder, trimmedStoreAddress),
        ]);

        if (cancelled || !containerRef.current) {
          return;
        }

        const mapId = getGoogleMapsMapId();
        const map = new google.maps.Map(containerRef.current, {
          ...(mapId ? { mapId } : {}),
          disableDefaultUI: true,
          gestureHandling: "greedy",
          clickableIcons: false,
        });

        fitMapToLocations(map, [userLocation, storeLocation]);

        markers.push(
          new google.maps.Marker({
            map,
            position: storeLocation,
            title: "매장",
            icon: createMapMarkerIcon(google.maps, "store"),
            zIndex: 3,
          }),
          new google.maps.Marker({
            map,
            position: userLocation,
            title: "배달 주소",
            icon: createMapMarkerIcon(google.maps, "user"),
            zIndex: 4,
          })
        );

        let routePath: google.maps.LatLng[];
        try {
          routePath = await fetchRoadRoute(
            directionsService,
            storeLocation,
            userLocation
          );
        } catch {
          routePath = [
            new google.maps.LatLng(storeLocation.lat, storeLocation.lng),
            new google.maps.LatLng(userLocation.lat, userLocation.lng),
          ];
        }

        if (cancelled) {
          return;
        }

        fitMapToLocations(
          map,
          routePath.map((point) => ({
            lat: point.lat(),
            lng: point.lng(),
          }))
        );

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
      {ready && !error && <OrderTrackingMapLegend />}
    </div>
  );
}
