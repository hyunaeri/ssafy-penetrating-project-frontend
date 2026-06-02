function getTossSdkUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_TOSS_SDK_URL?.trim() ??
    process.env.TOSS_SDK_URL?.trim();
  if (!url) {
    throw new Error("NEXT_PUBLIC_TOSS_SDK_URL 환경변수가 설정되지 않았습니다.");
  }
  return url;
}

export function loadTossPaymentsSdk(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("브라우저 환경에서만 결제 SDK를 불러올 수 있습니다."));
  }
  const sdkUrl = getTossSdkUrl();

  if (window.TossPayments) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${sdkUrl}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("결제 SDK를 불러오지 못했습니다.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = sdkUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("결제 SDK를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });
}

export function getTossClientKey(): string {
  const key = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY?.trim();
  if (!key) {
    throw new Error("NEXT_PUBLIC_TOSS_CLIENT_KEY 환경변수가 설정되지 않았습니다.");
  }
  return key;
}
