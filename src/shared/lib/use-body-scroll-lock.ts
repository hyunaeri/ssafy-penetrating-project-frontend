"use client";

import { useEffect } from "react";

let lockCount = 0;
let savedOverflow = "";

function lockBodyScroll() {
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;
}

function unlockBodyScroll() {
  if (lockCount <= 0) {
    lockCount = 0;
    document.body.style.overflow = "";
    return;
  }

  lockCount -= 1;
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow;
    savedOverflow = "";
  }
}

/** 모달 등에서 배경 스크롤을 막을 때 사용 (중첩 모달·페이지 이탈 시에도 안전하게 해제) */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [locked]);
}
