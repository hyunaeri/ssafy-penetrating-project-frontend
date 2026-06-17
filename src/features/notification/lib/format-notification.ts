import type { NotificationType } from "@/entities/notification";

export type ParsedNotificationContent = {
  storeName: string | null;
  body: string;
};

export type NotificationDisplay = {
  headline: string;
  storeName: string | null;
  body: string | null;
};

/** `[매장명] 본문` 형태의 알림 메시지를 분리한다. */
export function parseNotificationContent(message: string): ParsedNotificationContent {
  const trimmed = message.trim();
  const match = trimmed.match(/^\[([^\]]+)\]\s*([\s\S]*)$/);

  if (!match) {
    return { storeName: null, body: trimmed };
  }

  const storeName = match[1]?.trim() || null;
  const body = match[2]?.trim() || trimmed;

  return { storeName, body };
}

const ORDER_STATUS_SUFFIX_PATTERNS = [
  /결제가\s*완료되어\s*가게\s*접수\s*대기\s*중입니다\.?$/,
  /주문이\s*가게\s*접수\s*대기\s*중입니다\.?$/,
  /가게\s*접수\s*대기\s*중입니다\.?$/,
  /접수\s*대기\s*중입니다\.?$/,
  /조리\s*중입니다\.?$/,
  /배달\s*중입니다\.?$/,
  /배달이\s*완료되었습니다\.?$/,
  /주문이\s*취소되었습니다\.?$/,
];

function stripTrailingStatusPhrase(text: string): string {
  let simplified = text.trim();
  for (const pattern of ORDER_STATUS_SUFFIX_PATTERNS) {
    simplified = simplified.replace(pattern, "").trim();
  }
  return simplified.replace(/[.。]\s*$/, "").trim();
}

function extractMenuSummary(body: string): string | null {
  const simplified = stripTrailingStatusPhrase(body);
  return simplified || null;
}

function normalizeStatusPhrase(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return "";
  return /[.。]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function buildOrderHeadline(menuSummary: string | null, title: string): string {
  const status = normalizeStatusPhrase(title);
  if (menuSummary) {
    return `${menuSummary} ${status}`;
  }
  return status;
}

function simplifyBody(title: string, body: string): string | null {
  const simplified = stripTrailingStatusPhrase(body);
  if (!simplified) return null;
  if (title.includes(simplified) || simplified.includes(title)) return null;
  return simplified;
}

/** 제목·본문·매장명을 화면에 보여주기 좋게 정리한다. */
export function resolveNotificationDisplay(
  type: NotificationType,
  title: string,
  message: string,
  storeNameFromApi?: string | null
): NotificationDisplay {
  const parsed = parseNotificationContent(message);
  const storeName = storeNameFromApi?.trim() || parsed.storeName;

  if (type === "ORDER_STATUS") {
    const menuSummary = parsed.body ? extractMenuSummary(parsed.body) : null;
    return {
      headline: buildOrderHeadline(menuSummary, title),
      storeName,
      body: null,
    };
  }

  return {
    headline: title,
    storeName,
    body: parsed.body ? simplifyBody(title, parsed.body) : null,
  };
}

const TYPE_LABELS: Record<NotificationType, string> = {
  ORDER_STATUS: "주문",
  ACHIEVEMENT: "업적",
  COUPON: "쿠폰",
  RANKING: "랭킹",
  SYSTEM: "시스템",
};

const TYPE_ACCENT_CLASS: Record<NotificationType, string> = {
  ORDER_STATUS: "text-brand-dark",
  ACHIEVEMENT: "text-accent-warm-text",
  COUPON: "text-accent-purple-text",
  RANKING: "text-accent-blue-text",
  SYSTEM: "text-muted",
};

const TYPE_ICON_CLASS: Record<NotificationType, string> = {
  ORDER_STATUS: "bg-brand/10 text-brand-dark",
  ACHIEVEMENT: "bg-accent-warm text-accent-warm-text",
  COUPON: "bg-accent-purple text-accent-purple-text",
  RANKING: "bg-accent-blue text-accent-blue-text",
  SYSTEM: "bg-surface text-muted",
};

export function formatNotificationType(type: NotificationType): string {
  return TYPE_LABELS[type] ?? "알림";
}

export function getNotificationTypeAccentClass(type: NotificationType): string {
  return TYPE_ACCENT_CLASS[type] ?? "text-muted";
}

export function getNotificationTypeIconClass(type: NotificationType): string {
  return TYPE_ICON_CLASS[type] ?? "bg-surface text-muted";
}

/** 알림 생성 시각을 "방금 전 / N분 전 / N시간 전 / 날짜" 형태로 표기 */
export function formatNotificationTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}일 전`;

  return date.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  });
}
