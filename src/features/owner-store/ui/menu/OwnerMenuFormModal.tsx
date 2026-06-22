"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { OwnerMenuPayload } from "@/entities/owner-menu";
import type { MenuResponse } from "@/entities/store/model/types";
import {
  DEFAULT_OWNER_MENU_FORM,
  menuToOwnerMenuForm,
  type OwnerMenuFormValues,
} from "@/features/owner-store/model/owner-menu-form";
import { OwnerMenuFormFields } from "@/features/owner-store/ui/menu/OwnerMenuFormFields";
import { useBodyScrollLock } from "@/shared/lib/use-body-scroll-lock";
import { resolveRepresentativeImage } from "@/shared/lib/resolve-representative-image";
import { PrimaryButton } from "@/shared/ui";
import { LazyImage } from "@/shared/ui/lazy-image/LazyImage";

type OwnerMenuFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  menu?: MenuResponse | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (values: OwnerMenuFormValues) => Promise<void>;
};

export function OwnerMenuFormModal({
  open,
  mode,
  menu,
  saving = false,
  onClose,
  onSubmit,
}: OwnerMenuFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<OwnerMenuPayload>(DEFAULT_OWNER_MENU_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && menu) {
      setForm(menuToOwnerMenuForm(menu));
    } else {
      setForm(DEFAULT_OWNER_MENU_FORM);
    }
    setImage(null);
  }, [open, mode, menu]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const title = mode === "create" ? "새 메뉴 추가" : "메뉴 수정";
  const submitLabel =
    mode === "create"
      ? saving
        ? "등록 중..."
        : "메뉴 추가"
      : saving
        ? "저장 중..."
        : "변경사항 저장";

  const previewSrc =
    previewUrl ?? resolveRepresentativeImage(menu?.imageUrl);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit({ ...form, image });
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-5">
      <button
        type="button"
        aria-label={`${title} 닫기`}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 flex max-h-[90dvh] w-full max-w-mobile flex-col overflow-hidden rounded-t-[1.25rem] border border-line bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:rounded-[1.25rem]"
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-line px-4">
          <span className="text-[15px] font-bold text-ink">{title}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
          >
            닫기
          </button>
        </div>

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {mode === "edit" && menu && (
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-surface px-3 py-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-inset ring-line/80">
                  <LazyImage
                    src={previewSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <p className="min-w-0 text-[13px] leading-relaxed text-muted">
                  {image
                    ? "새 이미지로 교체됩니다."
                    : "이미지를 바꾸려면 아래에서 파일을 선택하세요."}
                </p>
              </div>
            )}

            <OwnerMenuFormFields
              form={form}
              onChange={setForm}
              imageLabel={
                mode === "create" ? "메뉴 이미지 (선택)" : "이미지 변경 (선택)"
              }
              onImageChange={setImage}
            />
          </div>

          <div className="shrink-0 border-t border-line/80 px-4 py-4">
            <PrimaryButton type="submit" disabled={saving}>
              {submitLabel}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export type { OwnerMenuFormValues };
