import { NextRequest, NextResponse } from "next/server";

type KakaoDirectionsRoad = {
  vertexes?: number[];
};

type KakaoDirectionsSection = {
  roads?: KakaoDirectionsRoad[];
};

type KakaoDirectionsRoute = {
  sections?: KakaoDirectionsSection[];
};

type KakaoDirectionsResponse = {
  routes?: KakaoDirectionsRoute[];
  message?: string;
};

function extractRoutePath(
  data: KakaoDirectionsResponse
): Array<{ lat: number; lng: number }> {
  const path: Array<{ lat: number; lng: number }> = [];
  const route = data.routes?.[0];

  if (!route?.sections) {
    return path;
  }

  for (const section of route.sections) {
    for (const road of section.roads ?? []) {
      const vertexes = road.vertexes ?? [];

      for (let index = 0; index < vertexes.length; index += 2) {
        const lng = vertexes[index];
        const lat = vertexes[index + 1];

        if (lat != null && lng != null) {
          path.push({ lat, lng });
        }
      }
    }
  }

  return path;
}

/** `GET /api/route/directions` — 카카오모빌리티 길찾기 프록시. */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const originLat = searchParams.get("originLat");
  const originLng = searchParams.get("originLng");
  const destLat = searchParams.get("destLat");
  const destLng = searchParams.get("destLng");

  if (!originLat || !originLng || !destLat || !destLng) {
    return NextResponse.json({ message: "좌표가 필요합니다." }, { status: 400 });
  }

  const restApiKey = process.env.KAKAO_REST_API_KEY?.trim();
  if (!restApiKey) {
    return NextResponse.json(
      { message: "Kakao API 설정이 올바르지 않습니다." },
      { status: 500 }
    );
  }

  const url = new URL("https://apis-navi.kakaomobility.com/v1/directions");
  url.searchParams.set("origin", `${originLng},${originLat}`);
  url.searchParams.set("destination", `${destLng},${destLat}`);
  url.searchParams.set("priority", "DISTANCE");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `KakaoAK ${restApiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = (await response.json().catch(() => ({}))) as KakaoDirectionsResponse;

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message ?? "배달 경로를 찾지 못했습니다." },
        { status: response.status }
      );
    }

    const path = extractRoutePath(data);
    if (path.length === 0) {
      return NextResponse.json(
        { message: "배달 경로를 찾지 못했습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ path });
  } catch (error) {
    console.error("Failed to fetch Kakao directions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
