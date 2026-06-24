import type {
  AchievementGradeBackend,
  CollectionGrade,
  CollectionItem,
  CollectionItemResponse,
} from "../model/types";

const FRONT_GRADES: CollectionGrade[] = [
  "NORMAL",
  "EPIC",
  "UNIQUE",
  "LEGENDARY",
];

const BACKEND_GRADE_MAP: Record<AchievementGradeBackend, CollectionGrade> = {
  NORMAL: "NORMAL",
  RARE: "EPIC",
  UNIQUE: "UNIQUE",
  LEGENDARY: "LEGENDARY",
};

function mapGrade(value: unknown): CollectionGrade | null {
  if (typeof value !== "string") return null;

  if (FRONT_GRADES.includes(value as CollectionGrade)) {
    return value as CollectionGrade;
  }

  if (value in BACKEND_GRADE_MAP) {
    return BACKEND_GRADE_MAP[value as AchievementGradeBackend];
  }

  return null;
}

function readId(raw: CollectionItemResponse): number | null {
  if (typeof raw.achievementId === "number") return raw.achievementId;
  if (typeof raw.id === "number") return raw.id;
  return null;
}

function normalizeItem(raw: CollectionItemResponse): CollectionItem | null {
  const id = readId(raw);
  if (id === null || !raw.name?.trim()) {
    return null;
  }

  const grade = mapGrade(raw.grade);
  if (!grade) {
    return null;
  }

  const imageUrl = raw.imageUrl?.trim() || null;

  return {
    id,
    name: raw.name.trim(),
    description: raw.description?.trim() ?? "",
    grade,
    imageUrl,
    ratingPoint:
      typeof raw.ratingPoint === "number" && Number.isFinite(raw.ratingPoint)
        ? raw.ratingPoint
        : 0,
    collected: raw.achieved ?? raw.collected ?? false,
    achievedAt: raw.achievedAt ?? null,
    hidden: raw.hidden ?? false,
  };
}

export function parseCatalogItemsResponse(data: unknown): CollectionItem[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => normalizeItem(item as CollectionItemResponse))
    .filter((item): item is CollectionItem => item !== null);
}
