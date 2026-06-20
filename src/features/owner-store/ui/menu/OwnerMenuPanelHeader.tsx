type OwnerMenuPanelHeaderProps = {
  totalCount: number;
  filteredCount: number;
  isSearching: boolean;
  loading: boolean;
  hasError: boolean;
  onAdd: () => void;
};

export function OwnerMenuPanelHeader({
  totalCount,
  filteredCount,
  isSearching,
  loading,
  hasError,
  onAdd,
}: OwnerMenuPanelHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[16px] font-bold text-ink">메뉴 관리</h2>
        {!loading && !hasError && (
          <p className="mt-0.5 text-[13px] text-muted">
            {isSearching ? (
              <>
                <span className="font-semibold text-brand-dark">
                  {filteredCount}
                </span>
                /{totalCount}개
              </>
            ) : (
              <>{totalCount}개</>
            )}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onAdd}
        disabled={loading || hasError}
        className="shrink-0 rounded-full bg-brand px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        + 메뉴 추가
      </button>
    </div>
  );
}
