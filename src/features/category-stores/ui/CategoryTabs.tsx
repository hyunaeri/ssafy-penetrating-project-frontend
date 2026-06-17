"use client";

import { useEffect, useRef } from "react";
import { FOOD_CATEGORIES, getCategoryPath } from "@/entities/category";
import { useAppRouter } from "@/shared/lib/use-app-router";

type CategoryTabsProps = {
  activeId: number;
};

/**
 * 카테고리 상세 화면 상단의 가로 스크롤 탭.
 * 탭 전환은 replace로 처리해 히스토리에 쌓이지 않게 한다.
 * 뒤로 가기 시 진입 직전 화면(보통 메인)으로 돌아간다.
 */
export function CategoryTabs({ activeId }: CategoryTabsProps) {
  const router = useAppRouter();
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
    });
  }, [activeId]);

  const navigate = (href: string) => {
    router.replace(href);
  };

  return (
    <nav
      aria-label="카테고리"
      className="scrollbar-none flex gap-1 overflow-x-auto border-b border-line/80 bg-white px-2"
    >
      <Tab
        label="홈"
        active={false}
        onClick={() => navigate("/main")}
      />
      {FOOD_CATEGORIES.map((category) => {
        const active = category.id === activeId;
        return (
          <Tab
            key={category.id}
            ref={active ? activeRef : undefined}
            label={category.name}
            active={active}
            onClick={() => {
              if (!active) {
                navigate(getCategoryPath(category.id));
              }
            }}
          />
        );
      })}
    </nav>
  );
}

type TabProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  ref?: React.Ref<HTMLButtonElement>;
};

function Tab({ label, active, onClick, ref }: TabProps) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative shrink-0 whitespace-nowrap px-3 py-3 text-[15px] transition-colors ${
        active ? "font-bold text-ink" : "font-medium text-muted hover:text-ink"
      }`}
    >
      {label}
      {active && (
        <span className="absolute inset-x-2 bottom-0 h-[2.5px] rounded-full bg-ink" />
      )}
    </button>
  );
}
