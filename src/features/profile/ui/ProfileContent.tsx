"use client";

import Image from "next/image";
import {
  formatProviderLabel,
  formatUserRole,
  type UserResponse,
} from "@/entities/user";

type ProfileContentProps = {
  user: UserResponse;
};

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-line py-4 last:border-b-0">
      <p className="text-[12px] font-medium text-muted">{label}</p>
      <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-ink">
        {value}
      </p>
    </div>
  );
}

function displayValue(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "등록된 정보가 없습니다";
}

export function ProfileContent({ user }: ProfileContentProps) {
  return (
    <div className="flex flex-1 flex-col">
      <section className="mb-6 flex flex-col items-center gap-4 border border-line bg-surface px-6 py-8">
        {user.profileImageUrl ? (
          <Image
            src={user.profileImageUrl}
            alt=""
            width={88}
            height={88}
            className="h-[88px] w-[88px] rounded-full object-cover"
            unoptimized
          />
        ) : (
          <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-line text-[24px] font-medium text-muted">
            {user.nickname?.charAt(0) ?? "?"}
          </span>
        )}
        <div className="text-center">
          <p className="text-[18px] font-semibold text-ink">{user.nickname}</p>
          <p className="mt-1 text-[13px] text-muted">{user.email}</p>
        </div>
      </section>

      <section className="border border-line bg-white px-5">
        <ProfileField label="이메일" value={user.email} />
        <ProfileField label="연락처" value={displayValue(user.phoneNumber)} />
        <ProfileField label="주소" value={displayValue(user.address)} />
        <ProfileField
          label="로그인 방식"
          value={`${formatProviderLabel(user.provider)} 계정`}
        />
        <ProfileField label="역할" value={formatUserRole(user.role)} />
      </section>
    </div>
  );
}
