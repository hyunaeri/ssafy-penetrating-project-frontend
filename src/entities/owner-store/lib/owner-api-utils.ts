export function appendJsonPart(
  formData: FormData,
  name: string,
  value: unknown
) {
  formData.append(
    name,
    new Blob([JSON.stringify(value)], { type: "application/json" })
  );
}

async function readErrorMessage(data: unknown, fallback: string) {
  if (typeof data === "object" && data !== null) {
    const message = (data as { message?: string }).message;
    if (message) return message;
  }
  return fallback;
}

export async function parseJsonResponse<T>(res: Response, fallback: string) {
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(await readErrorMessage(data, fallback));
  }
  return data as T;
}

export async function parseEmptyResponse(res: Response, fallback: string) {
  if (res.ok || res.status === 204) return;

  const data: unknown = await res.json().catch(() => ({}));
  throw new Error(await readErrorMessage(data, fallback));
}

export function authHeaders(token: string, extra?: HeadersInit): HeadersInit {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...extra,
  };
}
