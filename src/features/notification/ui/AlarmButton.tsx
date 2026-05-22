"use client";

import { HeaderIconButton } from "@/shared/ui/header-icon-link";

export function AlarmButton() {
  return (
    <HeaderIconButton
      label="알림"
      onClick={() => {
        /* TODO: 알림 화면 연동 */
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    </HeaderIconButton>
  );
}
