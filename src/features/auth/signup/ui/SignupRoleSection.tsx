import { RolePicker } from "@/features/role-picker";
import type { SignupRole } from "@/entities/user";

type SignupRoleSectionProps = {
  role: SignupRole | null;
  onRoleChange: (role: SignupRole) => void;
};

export function SignupRoleSection({ role, onRoleChange }: SignupRoleSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-[13px] font-medium text-ink">역할 선택</h2>
      <p className="text-[12px] leading-relaxed text-muted">
        저희 서비스에서 어떤 역할로 이용하실지 선택해 주세요.
      </p>
      <RolePicker value={role} onChange={onRoleChange} />
    </section>
  );
}
