type OwnerOrdersEmptyStateProps = {
  isSearching: boolean;
};

export function OwnerOrdersEmptyState({ isSearching }: OwnerOrdersEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="text-[40px]" aria-hidden>
        📋
      </span>
      <div>
        <p className="text-[16px] font-bold text-ink">
          {isSearching ? "검색 결과가 없어요" : "들어온 주문이 없어요"}
        </p>
        <p className="mt-2 text-[14px] text-muted">
          {isSearching
            ? "주문번호나 메뉴명으로 다시 검색해 보세요."
            : "고객 주문이 들어오면 여기에서 접수·조리 상태를 관리할 수 있어요."}
        </p>
      </div>
    </div>
  );
}
