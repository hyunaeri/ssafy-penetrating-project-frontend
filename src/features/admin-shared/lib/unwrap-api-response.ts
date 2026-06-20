export function unwrapResponseBody(body: unknown): unknown {
  let current = body;

  for (let i = 0; i < 4; i += 1) {
    if (!current || Array.isArray(current) || typeof current !== "object") {
      break;
    }

    const record = current as Record<string, unknown>;

    if (record.data !== undefined) {
      current = record.data;
      continue;
    }

    if (record.result !== undefined) {
      current = record.result;
      continue;
    }

    break;
  }

  return current;
}

export function extractArray<T>(
  body: unknown,
  preferredKeys: string[] = []
): T[] {
  const unwrapped = unwrapResponseBody(body);

  if (Array.isArray(unwrapped)) {
    return unwrapped as T[];
  }

  if (!unwrapped || typeof unwrapped !== "object") {
    return [];
  }

  const record = unwrapped as Record<string, unknown>;
  const keys = [...preferredKeys, "content", "items", "list", "achievements", "coupons"];

  for (const key of keys) {
    if (Array.isArray(record[key])) {
      return record[key] as T[];
    }
  }

  return [];
}

export function unwrapEntity<T>(
  body: unknown,
  preferredKeys: string[] = []
): T {
  const unwrapped = unwrapResponseBody(body);

  if (!unwrapped || typeof unwrapped !== "object" || Array.isArray(unwrapped)) {
    return unwrapped as T;
  }

  const record = unwrapped as Record<string, unknown>;

  for (const key of preferredKeys) {
    if (record[key] && typeof record[key] === "object") {
      return record[key] as T;
    }
  }

  return unwrapped as T;
}
