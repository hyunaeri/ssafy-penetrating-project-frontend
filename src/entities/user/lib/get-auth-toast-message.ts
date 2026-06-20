import type { UserRole } from "@/entities/user/model/types";
import { isOwnerRole } from "@/entities/user/lib/get-home-path-by-role";

type AuthToastMessage = {
  title: string;
  description: string;
};

export function getLoginSuccessToast(role: UserRole): AuthToastMessage {
  if (isOwnerRole(role)) {
    return {
      title: "로그인 완료",
      description: "매장 관리 화면에서 주문과 매장을 확인할 수 있어요.",
    };
  }

  return {
    title: "로그인 완료",
    description: "지금부터 배달 서비스를 이용해보세요.",
  };
}

export function getSignupSuccessToast(role: UserRole): AuthToastMessage {
  if (isOwnerRole(role)) {
    return {
      title: "회원가입 완료",
      description: "매장 관리 화면으로 이동합니다.",
    };
  }

  return {
    title: "회원가입 완료",
    description: "추가 정보 등록이 끝났어요.\n메인 화면으로 이동합니다.",
  };
}
