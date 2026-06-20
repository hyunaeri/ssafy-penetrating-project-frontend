import Link from "next/link";
import { OWNER_QUICK_ACTIONS } from "@/features/owner-home/model/quick-actions";

type OwnerQuickActionGridProps = {
  query: string;
};

export function OwnerQuickActionGrid({ query }: OwnerQuickActionGridProps) {
  const trimmed = query.trim().toLowerCase();
  const actions = trimmed
    ? OWNER_QUICK_ACTIONS.filter((action) =>
        action.label.toLowerCase().includes(trimmed)
      )
    : OWNER_QUICK_ACTIONS;

  return (
    <section className="rounded-card bg-white px-3 py-4 shadow-card">
      {!trimmed && (
        <h2 className="px-1 pb-3 text-[16px] font-bold tracking-tight text-ink">
          무엇을 관리할까요?
        </h2>
      )}

      {actions.length === 0 ? (
        <p className="px-1 py-8 text-center text-[14px] text-muted">
          ‘{query.trim()}’ 메뉴를 찾지 못했어요.
        </p>
      ) : (
        <ul className="grid grid-cols-4 gap-x-3 gap-y-6">
          {actions.map((action) => (
            <li key={`${action.href}-${action.label}`}>
              <Link
                href={action.href}
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className="relative flex aspect-square w-[78%] items-center justify-center overflow-hidden rounded-2xl text-[34px] ring-1 ring-inset ring-line/70 transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_10px_22px_rgba(42,193,188,0.22)] group-hover:ring-brand/40 group-active:translate-y-0 group-active:scale-95"
                  style={{ backgroundColor: action.background }}
                >
                  <span aria-hidden>{action.emoji}</span>
                </span>
                <span className="line-clamp-1 text-center text-[12.5px] font-medium text-ink transition-colors group-hover:text-brand-dark">
                  {action.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
