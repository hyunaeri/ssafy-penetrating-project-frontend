const OPTIMIZED_HOSTS = new Set([
  "localhost",
  "api.whik.store",
  "lh3.googleusercontent.com",
]);

export function shouldUnoptimizeImage(src: string): boolean {
  if (src.startsWith("/")) {
    return false;
  }

  try {
    const { hostname } = new URL(src);
    if (
      OPTIMIZED_HOSTS.has(hostname) ||
      hostname.endsWith(".googleusercontent.com")
    ) {
      return false;
    }
  } catch {
    return true;
  }

  return true;
}
