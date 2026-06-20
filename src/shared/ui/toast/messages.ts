/** 인증·회원가입 토스트 문구 (제목 + 보조 설명) */
export const toastMessages = {
  login: {
    success: {
      title: "로그인 완료",
      description: "지금부터 배달 서비스를 이용해보세요.",
    },
    fail: {
      title: "로그인 실패",
      description: "잠시 후 다시 시도해 주세요.",
    },
    failNoToken: {
      title: "로그인 실패",
      description: "인증 정보를 찾을 수 없어요. \n처음부터 다시 진행해 주세요.",
    },
  },
  signup: {
    success: {
      title: "회원가입 완료",
      description: "추가 정보 등록이 끝났어요.\n메인 화면으로 이동합니다.",
    },
    fail: {
      title: "회원가입 실패",
      description: "입력한 정보를 확인한 뒤 다시 시도해 주세요.",
    },
  },
  admin: {
    notRegistered: {
      title: "등록된 관리자 계정이 아닙니다.",
      description: "DB에 등록된 Google 계정으로 로그인해 주세요.",
    },
  },
  logout: {
    success: {
      title: "로그아웃 완료",
      description: "안전하게 로그아웃되었어요.",
    },
    fail: {
      title: "로그아웃 실패",
      description: "잠시 후 다시 시도해 주세요.",
    },
  },
  cart: {
    addSuccess: {
      title: "장바구니에 담았어요",
      description: "담은 메뉴는 장바구니에서 확인할 수 있어요.",
    },
    addFail: {
      title: "담기 실패",
      description: "잠시 후 다시 시도해 주세요.",
    },
  },
} as const;
