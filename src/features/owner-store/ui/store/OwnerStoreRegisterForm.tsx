"use client";

import { useState } from "react";
import { registerOwnerStore } from "@/entities/owner-store";
import { DEFAULT_OWNER_STORE_FORM } from "@/features/owner-store/model/owner-store-form";
import { OwnerStoreFormFields } from "@/features/owner-store/ui/store/OwnerStoreFormFields";
import { PrimaryButton, notifyError, notifySuccess } from "@/shared/ui";

type OwnerStoreRegisterFormProps = {
  onRegistered: () => void;
};

export function OwnerStoreRegisterForm({
  onRegistered,
}: OwnerStoreRegisterFormProps) {
  const [form, setForm] = useState(DEFAULT_OWNER_STORE_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await registerOwnerStore({ ...form, image });
      notifySuccess("매장이 등록되었습니다.");
      onRegistered();
    } catch (error) {
      notifyError(
        error instanceof Error ? error.message : "매장 등록에 실패했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="soft-card px-4 py-5">
      <h2 className="text-[16px] font-bold text-ink">매장 등록</h2>
      <p className="mt-1 text-[13px] text-muted">
        아직 등록된 매장이 없어요. 아래 정보를 입력해 매장을 등록해 주세요.
      </p>

      <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
        <OwnerStoreFormFields
          form={form}
          onChange={setForm}
          onImageChange={setImage}
        />

        <PrimaryButton type="submit" disabled={submitting}>
          {submitting ? "등록 중..." : "매장 등록하기"}
        </PrimaryButton>
      </form>
    </section>
  );
}
