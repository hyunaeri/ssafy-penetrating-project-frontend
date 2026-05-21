import { SIGNUP_ROLES, type SignupRole } from "@/entities/user";

type RolePickerProps = {
  value: SignupRole | null;
  onChange: (role: SignupRole) => void;
};

export function RolePicker({ value, onChange }: RolePickerProps) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="역할 선택">
      {SIGNUP_ROLES.map((role) => {
        const selected = value === role.value;

        return (
          <button
            key={role.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(role.value)}
            className={[
              "w-full border px-4 py-4 text-left transition-colors",
              selected
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink hover:border-ink/40",
            ].join(" ")}
          >
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="block text-[15px] font-semibold tracking-tight">
                  {role.label}
                </span>
                <span
                  className={[
                    "mt-1 block text-[12px] leading-relaxed",
                    selected ? "text-white/80" : "text-muted",
                  ].join(" ")}
                >
                  {role.description}
                </span>
              </span>
              <span
                className={[
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px]",
                  selected
                    ? "border-white bg-white text-ink"
                    : "border-line bg-surface text-transparent",
                ].join(" ")}
                aria-hidden
              >
                {selected ? "✓" : ""}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
