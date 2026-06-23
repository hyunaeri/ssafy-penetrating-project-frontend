export function isDuplicateReviewError(message: string) {
  return message.includes("이미 해당 주문에 대한 리뷰가 작성되었습니다");
}
