const OAUTH_INTENT_KEY = "oauthIntent";

export type OAuthIntent = "admin" | "customer";

export function setOAuthIntent(intent: OAuthIntent): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(OAUTH_INTENT_KEY, intent);
}

export function getOAuthIntent(): OAuthIntent | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(OAUTH_INTENT_KEY);
  if (value === "admin" || value === "customer") return value;
  return null;
}

export function clearOAuthIntent(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(OAUTH_INTENT_KEY);
}
