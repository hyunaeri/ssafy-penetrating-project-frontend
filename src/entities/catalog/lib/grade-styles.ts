import type { CollectionGrade } from "../model/types";

export type GradeStyle = {
  label: string;
  badgeClass: string;
  frameClass: string;
  auraClass: string | null;
  tiltMax: number;
  perspective: number;
  holoEnabled: boolean;
  holoGradient: string;
  holoOpacity: number;
};

export const GRADE_STYLES: Record<CollectionGrade, GradeStyle> = {
  NORMAL: {
    label: "노말",
    badgeClass: "bg-surface text-muted ring-line/80",
    frameClass: "shadow-card",
    auraClass: "collection-card-aura--normal",
    tiltMax: 10,
    perspective: 560,
    holoEnabled: false,
    holoGradient: "",
    holoOpacity: 0,
  },
  EPIC: {
    label: "에픽",
    badgeClass:
      "bg-accent-purple text-accent-purple-text ring-accent-purple-text/20",
    frameClass: "shadow-[0_10px_28px_rgba(99,102,241,0.28)]",
    auraClass: "collection-card-aura--epic",
    tiltMax: 10,
    perspective: 560,
    holoEnabled: true,
    holoGradient:
      "linear-gradient(105deg, transparent 32%, rgba(196, 181, 253, 0.95) 42%, rgba(129, 140, 248, 0.9) 50%, rgba(167, 139, 250, 0.92) 58%, transparent 68%)",
    holoOpacity: 0.88,
  },
  UNIQUE: {
    label: "유니크",
    badgeClass:
      "bg-[linear-gradient(180deg,#b91c1c_0%,#7f1d1d_100%)] text-white ring-[#450a0a]/40",
    frameClass: "shadow-[0_12px_32px_rgba(127,29,29,0.34)]",
    auraClass: "collection-card-aura--unique",
    tiltMax: 10,
    perspective: 560,
    holoEnabled: true,
    holoGradient:
      "linear-gradient(105deg, transparent 30%, rgba(239, 68, 68, 0.78) 40%, rgba(185, 28, 28, 0.88) 50%, rgba(153, 27, 27, 0.72) 60%, transparent 70%)",
    holoOpacity: 0.88,
  },
  LEGENDARY: {
    label: "레전드리",
    badgeClass:
      "bg-[linear-gradient(180deg,#c5d926_0%,#98b800_100%)] text-[#2f3d00] ring-[#6b8f00]/35",
    frameClass: "shadow-[0_13px_34px_rgba(152,184,0,0.32)]",
    auraClass: "collection-card-aura--legendary",
    tiltMax: 12,
    perspective: 600,
    holoEnabled: true,
    holoGradient:
      "linear-gradient(105deg, transparent 30%, rgba(213, 232, 76, 0.9) 40%, rgba(168, 201, 41, 0.85) 50%, rgba(255, 255, 255, 0.72) 60%, transparent 70%)",
    holoOpacity: 0.96,
  },
};

export function getGradeStyle(grade: CollectionGrade): GradeStyle {
  return GRADE_STYLES[grade];
}
