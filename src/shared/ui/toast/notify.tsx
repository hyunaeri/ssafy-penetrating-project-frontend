"use client";

import { toast } from "sonner";
import { ToastErrorIcon, ToastSuccessIcon } from "./ToastIcons";

const TOAST_BASE =
  "!w-full !flex !flex-row !items-center !gap-3 !rounded-2xl !border !shadow-soft !px-3.5 !py-3.5";

const TOAST_SUCCESS = `${TOAST_BASE} !border-brand/20 !bg-[#ecfafa] !text-ink`;
const TOAST_ERROR = `${TOAST_BASE} !border-[#fde8c8] !bg-accent-warm !text-ink`;

const TOAST_ICON = "!shrink-0 !self-center";
const TOAST_CONTENT =
  "!flex !min-w-0 !flex-1 !flex-col !justify-center !gap-0.5";
const TOAST_TITLE =
  "!font-sans !text-[14px] !font-semibold !leading-[1.45] !tracking-normal !text-ink";
const TOAST_DESCRIPTION =
  "!whitespace-pre-line !font-sans !text-[13px] !font-normal !leading-[1.45] !tracking-normal !text-muted/90";

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
