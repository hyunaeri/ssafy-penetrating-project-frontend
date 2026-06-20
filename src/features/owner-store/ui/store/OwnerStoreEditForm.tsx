"use client";

import { useState } from "react";
import type { OwnerStorePayload } from "@/entities/owner-store";
import { updateOwnerStore } from "@/entities/owner-store";
import { storeToOwnerStoreForm } from "@/features/owner-store/model/owner-store-form";
import type { StoreDetailResponse } from "@/entities/store/model/types";
import { OwnerStoreFormFields } from "@/features/owner-store/ui/store/OwnerStoreFormFields";
import { PrimaryButton, notifyError, notifySuccess } from "@/shared/ui";

type OwnerStoreEditFormProps = {
  store: StoreDetailResponse;
  onUpdated: () => void;
  onCancel: () => void;
};

export function OwnerStoreEditForm({
  store,
  onUpdated,
  onCancel,
}: OwnerStoreEditFormProps) {
  const [form, setForm] = useState<OwnerStorePayload>(() =>
    storeToOwnerStoreForm(store)
  );
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await updateOwnerStore({
        storeId: store.id,
        ...form,
        image,
      });
      notifySuccess("매장 정보가 수정되었습니다.");
      onUpdated();
    } catch (error) {
      notifyError(
        error instanceof Error ? error.message : "매장 수정에 실패했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
      <OwnerStoreFormFields
        form={form}
        onChange={setForm}
        onImageChange={setImage}
      />

      <div className="flex gap-2">
        <PrimaryButton
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={submitting}
        >
          취소
        </PrimaryButton>
        <PrimaryButton type="submit" className="flex-1" disabled={submitting}>
          {submitting ? "저장 중..." : "변경사항 저장"}
        </PrimaryButton>
      </div>
    </form>
  );
}
