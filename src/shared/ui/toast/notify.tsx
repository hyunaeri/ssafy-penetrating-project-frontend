"use client";

import { toast } from "sonner";
import { ToastErrorIcon, ToastSuccessIcon } from "./ToastIcons";

const TOAST_CARD =
  "!w-full !flex !flex-row !items-center !gap-3 !rounded-2xl !border !border-line/80 !bg-white !px-4 !py-3.5 !shadow-[0_8px_28px_rgba(43,45,66,0.1)] !ring-1 !ring-black/[0.03]";

const TOAST_ICON = "!shrink-0 !self-center";
const TOAST_CONTENT =
  "!flex !min-w-0 !flex-1 !flex-col !justify-center !gap-0.5";
const TOAST_TITLE =
  "!font-sans !text-[14px] !font-semibold !leading-[1.4] !tracking-normal !text-ink";
const TOAST_DESCRIPTION =
  "!whitespace-pre-line !font-sans !text-[12px] !font-normal !leading-[1.55] !tracking-normal !text-muted";

type ToastContent = {
  title: string;
  description?: string;
};

function showToast(type: "success" | "error", { title, description }: ToastContent) {
  const icon = type === "success" ? <ToastSuccessIcon /> : <ToastErrorIcon />;
  const isError = type === "error";

  const options = {
    description,
    icon,
    duration: isError ? 4000 : 3000,
    classNames: {
      toast: TOAST_CARD,
      icon: TOAST_ICON,
      content: TOAST_CONTENT,
      title: TOAST_TITLE,
      description: TOAST_DESCRIPTION,
    },
  };

  if (isError) {
    toast.error(title, options);
    return;
  }

  toast.success(title, options);
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
