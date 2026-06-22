"use client";

import { motion } from "framer-motion";

export function OrderTrackingMapPlaceholder({
  message = "지도 API 연동 예정",
}: {
  message?: string | null;
} = {}) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-[#dfe6ee]"
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 430 320"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          d="M-20 210 C 80 170, 140 250, 220 190 S 380 120, 460 160"
          stroke="#ffffff"
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M40 80 C 120 120, 180 40, 260 90 S 360 180, 430 130"
          stroke="#f3f6f9"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M120 300 C 180 240, 240 280, 320 230"
          stroke="#c8d4df"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-full">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand shadow-float">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden
            >
              <path d="M12 2c-3.2 0-5.8 2.4-5.8 5.4 0 4.1 5.8 14.6 5.8 14.6s5.8-10.5 5.8-14.6C17.8 4.4 15.2 2 12 2Zm0 7.3a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
            </svg>
          </div>
          <div className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm bg-brand" />
        </motion.div>
      </div>

      {message ? (
        <p className="absolute bottom-[42%] left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-3 py-1 text-[12px] font-medium text-muted backdrop-blur-sm">
          {message}
        </p>
      ) : null}
    </div>
  );
}
