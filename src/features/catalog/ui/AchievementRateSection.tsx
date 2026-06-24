import type { CollectionGrade } from "@/entities/catalog";
import { getGradeStyle } from "@/entities/catalog";

type AchievementRateSectionProps = {
  grade: CollectionGrade;
  rate: number;
};

const RATE_BAR_STYLES: Record<
  CollectionGrade,
  {
    labelClass: string;
    percentClass: string;
    trackClass: string;
    fillClass: string;
  }
> = {
  NORMAL: {
    labelClass: "text-slate-500",
    percentClass: "text-slate-500",
    trackClass: "bg-[#dfe3ea] ring-1 ring-inset ring-[#c5ccd6]",
    fillClass: "bg-gradient-to-r from-slate-400 to-slate-500",
  },
  EPIC: {
    labelClass: "text-accent-purple-text",
    percentClass: "text-accent-purple-text",
    trackClass: "bg-[#e8e7ff] ring-1 ring-inset ring-[#c7c2ff]",
    fillClass: "bg-gradient-to-r from-indigo-400 via-indigo-500 to-violet-500",
  },
  UNIQUE: {
    labelClass: "text-[#991b1b]",
    percentClass: "text-[#991b1b]",
    trackClass: "bg-[#fde2e2] ring-1 ring-inset ring-[#f5b5b5]",
    fillClass: "bg-gradient-to-r from-red-600 via-red-500 to-red-700",
  },
  LEGENDARY: {
    labelClass: "text-[#6b8f00]",
    percentClass: "text-[#6b8f00]",
    trackClass: "bg-[#eef6c8] ring-1 ring-inset ring-[#d4e157]",
    fillClass: "bg-gradient-to-r from-lime-500 via-lime-400 to-lime-600",
  },
};

export function AchievementRateSection({
  grade,
  rate,
}: AchievementRateSectionProps) {
  const style = getGradeStyle(grade);
  const barStyle = RATE_BAR_STYLES[grade];
  const clamped = Math.min(100, Math.max(0, rate));
  const hasFill = clamped > 0;

  return (
    <section
      className="mt-4 overflow-visible px-0.5 py-2"
      aria-label={`업적 달성률 ${rate}%`}
    >
      <div
        className={`collection-card-aura achievement-rate-aura ${style.auraClass}`}
      >
        <div className="rounded-[1.02rem] bg-white px-4 py-3.5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className={`text-[13px] font-bold ${barStyle.labelClass}`}>
                업적 달성률
              </p>
              <p className="mt-0.5 text-[12px] text-muted">
                전체 사용자 중 해당 업적을 달성한 비율
              </p>
            </div>
            <span
              className={`shrink-0 text-[24px] font-bold tabular-nums leading-none ${barStyle.percentClass}`}
            >
              {rate}%
            </span>
          </div>

          <div
            className={`relative mt-3 h-3 w-full overflow-hidden rounded-full ${barStyle.trackClass}`}
            role="progressbar"
            aria-valuenow={rate}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${barStyle.fillClass}`}
              style={{
                width: `${clamped}%`,
                minWidth: hasFill ? "8px" : "0px",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
