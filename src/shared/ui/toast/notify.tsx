"use client";

import { toast } from "sonner";
import { ToastErrorIcon, ToastSuccessIcon } from "./ToastIcons";

// 흰 카드 + 작은 컬러 아이콘 칩. 흰 배경 페이지 위에서도 떠 보이도록
// 강한 그림자와 얇은 링으로 입체감을 준다.
const TOAST_BASE =
  "!w-full !flex !flex-row !items-center !gap-3 !rounded-2xl !border !border-line !bg-white !shadow-[0_10px_34px_rgba(43,45,66,0.18)] !ring-1 !ring-black/5 !px-4 !py-3.5";

const TOAST_SUCCESS = TOAST_BASE;
const TOAST_ERROR = TOAST_BASE;

const TOAST_ICON = "!shrink-0 !self-center";
const TOAST_CONTENT =
  "!flex !min-w-0 !flex-1 !flex-col !justify-center !gap-1";
const TOAST_TITLE =
  "!font-sans !text-[14.5px] !font-bold !leading-[1.4] !tracking-normal !text-ink";
const TOAST_DESCRIPTION =
  "!whitespace-pre-line !font-sans !text-[13px] !font-normal !leading-[1.5] !tracking-normal !text-muted";

type ToastContent = {
  title: string;
  description?: string;
};

function showToast(type: "success" | "error", { title, description }: ToastContent) {
  const className = type === "success" ? TOAST_SUCCESS : TOAST_ERROR;
  const icon = type === "success" ? <ToastSuccessIcon /> : <ToastErrorIcon />;

  // success/error 헬퍼는 타입별 기본 스타일이 달라질 수 있어 동일 API로 통일
  toast(title, {
    description,
    icon,
    classNames: {
      toast: className,
      icon: TOAST_ICON,
      content: TOAST_CONTENT,
      title: TOAST_TITLE,
      description: TOAST_DESCRIPTION,
    },
  });
}

export function notifySuccess(content: ToastContent | string) {
  if (typeof content === "string") {
    showToast("success", { title: content });
    return;
  }
  showToast("success", content);
}

export function notifyError(content: ToastContent | string) {
  if (typeof content === "string") {
    showToast("error", { title: content });
    return;
  }
  showToast("error", content);
}
