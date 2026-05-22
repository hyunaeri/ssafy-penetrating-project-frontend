"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Address } from "react-daum-postcode";
import { formatSelectedAddress } from "@/features/auth/signup/lib/format-selected-address";
import type { SignupFormValues } from "@/features/auth/signup/model/types";

export function useSignupForm() {
  const [showPostcode, setShowPostcode] = useState(false);

  const form = useForm<SignupFormValues>({
    defaultValues: { phoneNumber: "", address: "", addressDetail: "" },
    mode: "onChange",
  });

  const phoneNumber = form.watch("phoneNumber");
  const address = form.watch("address");
  const addressDetail = form.watch("addressDetail");

  const handleAddressComplete = (data: Address) => {
    form.setValue("address", formatSelectedAddress(data), {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("addressDetail", "", { shouldDirty: false });
    setShowPostcode(false);
  };

  return {
    form,
    phoneNumber,
    address,
    addressDetail,
    showPostcode,
    openPostcode: () => setShowPostcode(true),
    closePostcode: () => setShowPostcode(false),
    handleAddressComplete,
  };
}
