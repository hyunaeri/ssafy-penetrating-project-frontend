let loadPromise: Promise<void> | undefined;

export function loadKakaoMaps(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Kakao Maps는 클라이언트에서만 사용할 수 있습니다.")
    );
  }

  if (loadPromise) {
    return loadPromise;
  }

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY?.trim();
  if (!appKey) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_KAKAO_MAP_APP_KEY가 설정되지 않았습니다.")
    );
  }

  loadPromise = new Promise((resolve, reject) => {
    const finishLoad = () => {
      const kakaoMaps = (window as Window & { kakao?: KakaoNamespace }).kakao
        ?.maps;

      if (!kakaoMaps) {
        reject(new Error("Kakao Maps SDK를 불러오지 못했습니다."));
        return;
      }

      kakaoMaps.load(() => resolve());
    };

    const root = (window as Window & { kakao?: KakaoNamespace }).kakao;
    if (root?.maps) {
      finishLoad();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-maps-sdk="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", finishLoad, { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Kakao Maps SDK를 불러오지 못했습니다.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.async = true;
    script.dataset.kakaoMapsSdk = "true";
    script.onload = finishLoad;
    script.onerror = () =>
      reject(new Error("Kakao Maps SDK를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });

  return loadPromise;
}
