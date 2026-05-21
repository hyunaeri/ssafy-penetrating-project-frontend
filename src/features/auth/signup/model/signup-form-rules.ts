import type { RegisterOptions } from "react-hook-form";
import type { SignupFormValues } from "@/features/auth/signup/model/types";

const trimRequired = (message: string) => (value: string) =>
  value.trim().length > 0 || message;

export const phoneNumberRules: RegisterOptions<
  SignupFormValues,
  "phoneNumber"
> = {
  required: "휴대폰 번호를 입력해 주세요.",
  validate: trimRequired("휴대폰 번호를 입력해 주세요."),
};

export const addressRules: RegisterOptions<SignupFormValues, "address"> = {
  required: "주소를 검색해 선택해 주세요.",
  validate: trimRequired("주소를 검색해 선택해 주세요."),
};
