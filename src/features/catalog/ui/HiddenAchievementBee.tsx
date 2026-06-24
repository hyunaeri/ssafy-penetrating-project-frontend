import Image from "next/image";

export function HiddenAchievementBee() {
  return (
    <div className="group/bee relative shrink-0">
      <span aria-label="히든 업적" className="relative block cursor-help">
        <Image
          src="/images/bee_happy.png"
          alt=""
          width={28}
          height={28}
          className="drop-shadow-[0_2px_6px_rgba(43,45,66,0.18)]"
        />
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-40 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-[0_4px_12px_rgba(43,45,66,0.2)] transition-opacity duration-150 group-hover/bee:opacity-100 after:absolute after:left-1/2 after:top-0 after:h-0 after:w-0 after:-translate-x-1/2 after:-translate-y-full after:border-x-[5px] after:border-b-[6px] after:border-x-transparent after:border-b-ink after:content-['']"
      >
        히든 업적
      </span>
    </div>
  );
}
