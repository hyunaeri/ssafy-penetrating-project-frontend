const NOTICE_ITEMS = [
  "메뉴 사진은 연출된 이미지로 실제 조리된 음식과 다를 수 있습니다.",
  "메뉴 및 가격은 매장에서 제공한 정보를 기준으로 작성되었으며 변동될 수 있습니다.",
  "메뉴별 리뷰 개수는 해당 메뉴가 포함된 주문에 대해 고객이 남겨주신 리뷰를 기준으로 산출된 것입니다.",
  "YumYumCoach는 상품거래에 대한 통신판매중개자이며, 통신판매의 당사자가 아닙니다. 따라서 상품·거래정보 및 거래에 대하여 책임을 지지 않습니다.",
] as const;

export function MenuNoticeSection() {
  return (
    <aside className="mt-2 flex-1 bg-[#f5f5f5] px-4 pb-10 pt-5">
      <h3 className="text-[14px] font-bold text-[#4b5563]">유의사항</h3>
      <ul className="mt-3 space-y-2.5">
        {NOTICE_ITEMS.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-[12px] leading-[1.6] text-[#8b95a1]"
          >
            <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#b0b8c1]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
