import { FOOD_CATEGORIES } from "@/entities/category/model/categories";
import type { OwnerStorePayload } from "@/entities/owner-store";

type OwnerStoreFormFieldsProps = {
  form: OwnerStorePayload;
  onChange: (next: OwnerStorePayload) => void;
  onImageChange: (file: File | null) => void;
  namePlaceholder?: string;
  descriptionPlaceholder?: string;
  addressPlaceholder?: string;
};

export function OwnerStoreFormFields({
  form,
  onChange,
  onImageChange,
  namePlaceholder = "매장 이름",
  descriptionPlaceholder = "매장 소개",
  addressPlaceholder = "매장 주소",
}: OwnerStoreFormFieldsProps) {
  return (
    <>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">카테고리</span>
        <select
          value={form.categoryId}
          onChange={(event) =>
            onChange({ ...form, categoryId: Number(event.target.value) })
          }
          className="rounded-xl border border-line bg-white px-3 py-2.5 text-[14px] text-ink"
        >
          {FOOD_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">매장명</span>
        <input
          required
          value={form.name}
          onChange={(event) => onChange({ ...form, name: event.target.value })}
          className="rounded-xl border border-line bg-white px-3 py-2.5 text-[14px] text-ink"
          placeholder={namePlaceholder}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">설명</span>
        <textarea
          value={form.description}
          onChange={(event) =>
            onChange({ ...form, description: event.target.value })
          }
          className="min-h-20 rounded-xl border border-line bg-white px-3 py-2.5 text-[14px] text-ink"
          placeholder={descriptionPlaceholder}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">주소</span>
        <input
          required
          value={form.address}
          onChange={(event) => onChange({ ...form, address: event.target.value })}
          className="rounded-xl border border-line bg-white px-3 py-2.5 text-[14px] text-ink"
          placeholder={addressPlaceholder}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">최소 주문금액</span>
          <input
            required
            type="number"
            min={0}
            value={form.minOrderPrice}
            onChange={(event) =>
              onChange({
                ...form,
                minOrderPrice: Number(event.target.value),
              })
            }
            className="rounded-xl border border-line bg-white px-3 py-2.5 text-[14px] text-ink"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-ink">배달비</span>
          <input
            required
            type="number"
            min={0}
            value={form.deliveryFee}
            onChange={(event) =>
              onChange({
                ...form,
                deliveryFee: Number(event.target.value),
              })
            }
            className="rounded-xl border border-line bg-white px-3 py-2.5 text-[14px] text-ink"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-ink">
          대표 이미지 (선택)
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onImageChange(event.target.files?.[0] ?? null)}
          className="text-[13px] text-muted"
        />
      </label>
    </>
  );
}
