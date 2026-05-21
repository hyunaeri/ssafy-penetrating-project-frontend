import Image from "next/image";
import type { SignupTokenPreview } from "@/entities/user";

type SignupProfileCardProps = {
  preview: SignupTokenPreview;
};

export function SignupProfileCard({ preview }: SignupProfileCardProps) {
  return (
    <section className="mb-8 flex flex-col items-center gap-4 border border-line bg-surface px-6 py-8">
      {preview.profileImageUrl ? (
        <Image
          src={preview.profileImageUrl}
          alt=""
          width={72}
          height={72}
          className="h-[72px] w-[72px] rounded-full object-cover"
          unoptimized
        />
      ) : (
        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-line text-[20px] font-medium text-muted">
          {preview.nickname?.charAt(0) ?? "?"}
        </span>
      )}
      <span className="text-center">
        <p className="text-[16px] font-medium text-ink">{preview.nickname}</p>
        <p className="mt-1 text-[13px] text-muted">{preview.email}</p>
      </span>
    </section>
  );
}
