import type { OwnerMenuPayload } from "@/entities/owner-menu";

type OwnerMenuFormFieldsProps = {
  form: OwnerMenuPayload;
  onChange: (next: OwnerMenuPayload) => void;
  imageLabel: string;
  onImageChange: (file: File | null) => void;
};

export function OwnerMenuFormFields({
  form,
  onChange,
  imageLabel,
  onImageChange,
}: OwnerMenuFormFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">메뉴명</span>
        <input
          required
          value={form.name}
          onChange={(event) =>
            onChange({ ...form, name: event.target.value })
          }
          className="rounded-xl border border-line bg-white px-3 py-2.5 text-[14px] text-ink"
          placeholder="메뉴 이름"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">설명</span>
        <input
          value={form.description}
          onChange={(event) =>
            onChange({ ...form, description: event.target.value })
          }
          className="rounded-xl border border-line bg-white px-3 py-2.5 text-[14px] text-ink"
          placeholder="메뉴 설명"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">가격</span>
        <input
          required
          type="number"
          min={1}
          value={form.price}
          onChange={(event) =>
            onChange({ ...form, price: Number(event.target.value) })
          }
          className="rounded-xl border border-line bg-white px-3 py-2.5 text-[14px] text-ink"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">{imageLabel}</span>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onImageChange(event.target.files?.[0] ?? null)}
          className="text-[13px] text-muted"
        />
      </label>
    </div>
  );
}
