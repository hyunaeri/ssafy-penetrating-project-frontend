"use client";

import { toast } from "sonner";
import { ToastErrorIcon, ToastSuccessIcon } from "./ToastIcons";

const TOAST_BASE =
  "!w-full !flex !flex-row !items-start !gap-3 !rounded-2xl !border !shadow-soft !px-3.5 !py-3.5";

const TOAST_SUCCESS = `${TOAST_BASE} !border-brand/20 !bg-[#ecfafa] !text-ink`;
const TOAST_ERROR = `${TOAST_BASE} !border-[#fde8c8] !bg-accent-warm !text-ink`;

const TOAST_ICON = "!mt-0 !shrink-0";
const TOAST_CONTENT = "!flex !min-w-0 !flex-1 !flex-col !gap-0.5";
const TOAST_TITLE = "!text-[14px] !font-semibold !leading-snug !tracking-normal";
const TOAST_DESCRIPTION =
  "!whitespace-pre-line !text-[13px] !font-normal !leading-relaxed !tracking-normal !text-muted/90";

type ToastContent = {
  title: string;
  description?: string;
};

function showToast(type: "success" | "error", { title, description }: ToastContent) {
  const className = type === "success" ? TOAST_SUCCESS : TOAST_ERROR;
  const fn = type === "success" ? toast.success : toast.error;
  const icon = type === "success" ? <ToastSuccessIcon /> : <ToastErrorIcon />;

  fn(title, {
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
