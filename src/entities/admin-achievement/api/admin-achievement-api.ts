import type {
  AchievementPayload,
  AchievementResponse,
} from "@/entities/admin-achievement/model/types";
import { getAccessToken } from "@/entities/session";
import { getApiBaseUrl } from "@/shared/api";

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  if (!token) throw new Error("로그인이 필요합니다.");
  return { Authorization: `Bearer ${token}` };
}

function createMultipartBody(
  requestData: AchievementPayload,
  imageFile?: File | null
): FormData {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(requestData)], { type: "application/json" })
  );
  if (imageFile) {
    formData.append("image", imageFile);
  }
  return formData;
}

export async function fetchAchievements(keyword?: string): Promise<unknown> {
  const params = keyword?.trim()
    ? `?keyword=${encodeURIComponent(keyword.trim())}`
    : "";
  const res = await fetch(`${getApiBaseUrl()}/api/admin/achievements${params}`, {
    headers: { ...authHeaders(), Accept: "application/json" },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "업적 목록 조회에 실패했습니다.");
  }
  return res.json();
}

export async function createAchievement(
  payload: AchievementPayload,
  imageFile: File
): Promise<unknown> {
  const res = await fetch(`${getApiBaseUrl()}/api/admin/achievements`, {
    method: "POST",
    headers: authHeaders(),
    body: createMultipartBody(payload, imageFile),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "업적 생성에 실패했습니다.");
  }
  return res.json();
}

export async function updateAchievement(
  achievementId: number,
  payload: AchievementPayload,
  imageFile?: File | null
): Promise<unknown> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/admin/achievements/${achievementId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: createMultipartBody(payload, imageFile),
    }
  );
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "업적 수정에 실패했습니다.");
  }
  return res.json();
}

export async function deleteAchievement(achievementId: number): Promise<void> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/admin/achievements/${achievementId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "업적 삭제에 실패했습니다.");
  }
}

export function getAchievementId(
  achievement: AchievementResponse
): number | null {
  return achievement.id ?? achievement.achievementId ?? null;
}
