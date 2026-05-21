"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { SIGNUP_INPUT_CLASS } from "@/features/auth/signup/model/constants";
import {
  addressRules,
  phoneNumberRules,
} from "@/features/auth/signup/model/signup-form-rules";
import type { SignupFormValues } from "@/features/auth/signup/model/types";

type SignupContactFieldsProps = {
  register: UseFormRegister<SignupFormValues>;
  errors: FieldErrors<SignupFormValues>;
  onOpenAddressSearch: () => void;
};

export function SignupContactFields({
  register,
  errors,
  onOpenAddressSearch,
}: SignupContactFieldsProps) {
  return (
    <section className="mb-8 space-y-4">
      <h2 className="text-[13px] font-medium text-ink">연락처</h2>
      <label className="block space-y-2">
        <span className="text-[12px] text-muted">휴대폰 번호</span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01012345678"
          className={SIGNUP_INPUT_CLASS}
          {...register("phoneNumber", phoneNumberRules)}
        />
        {errors.phoneNumber && (
          <p className="text-[12px] text-red-600">
            {errors.phoneNumber.message}
          </p>
        )}
      </label>
      <div className="block space-y-2">
        <span className="text-[12px] text-muted">주소</span>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            autoComplete="street-address"
            placeholder="주소를 검색 후 선택해 주세요."
            className={`${SIGNUP_INPUT_CLASS} min-w-0 flex-1`}
            {...register("address", addressRules)}
          />
          <button
            type="button"
            onClick={onOpenAddressSearch}
            className="h-12 shrink-0 border border-ink bg-white px-4 text-[13px] font-medium text-ink hover:bg-surface"
          >
            주소 검색
          </button>
        </div>
        {errors.address && (
          <p className="text-[12px] text-red-600">{errors.address.message}</p>
        )}
      </div>
    </section>
  );
}
