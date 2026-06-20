"use client";

import { useCallback, useEffect, useState } from "react";
import type { CouponResponse } from "@/entities/admin-coupon";
import {
  createCoupon,
  deleteCoupon,
  fetchCoupon,
  fetchCoupons,
  getCouponId,
  updateCoupon,
} from "@/entities/admin-coupon";
import { AdminPageHeader, extractArray, unwrapEntity } from "@/features/admin-shared";
import { CouponFormPanel } from "@/features/admin-coupons/ui/CouponFormPanel";
import { PrimaryButton, notifyError, notifySuccess } from "@/shared/ui";

export function AdminCouponsScreen() {
  const [keyword, setKeyword] = useState("");
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<CouponResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const loadList = useCallback(async (nextKeyword = keyword) => {
    setLoading(true);
    setStatus("쿠폰 목록을 불러오는 중입니다.");

    try {
      const body = await fetchCoupons(nextKeyword);
      const list = extractArray<CouponResponse>(body, ["coupons"]);
      setCoupons(list);
      setStatus(`쿠폰 ${list.length}개를 불러왔습니다.`);
    } catch (error) {
      setCoupons([]);
      setStatus(error instanceof Error ? error.message : "조회 실패");
      notifyError(error instanceof Error ? error.message : "조회 실패");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    void loadList("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDetail = async (couponId: string) => {
    if (!couponId) {
      setSelectedDetail(null);
      return;
    }

    setStatus(`쿠폰 ID ${couponId} 상세 조회 중`);
    try {
      const body = await fetchCoupon(Number(couponId));
      const coupon = unwrapEntity<CouponResponse>(body, ["coupon"]);
      setSelectedDetail(coupon);
      setStatus(`쿠폰 ID ${couponId} 정보를 수정 폼에 반영했습니다.`);
    } catch (error) {
      setSelectedDetail(null);
      notifyError(error instanceof Error ? error.message : "조회 실패");
    }
  };

  const handleCreate = async (
    payload: Parameters<typeof createCoupon>[0],
    imageFile: File | null
  ) => {
    if (!imageFile) return;
    setSubmitting(true);
    try {
      await createCoupon(payload, imageFile);
      notifySuccess("쿠폰이 생성되었습니다.");
      await loadList();
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "생성 실패");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (
    payload: Parameters<typeof updateCoupon>[1],
    imageFile: File | null
  ) => {
    if (!selectedId) return;
    setSubmitting(true);
    try {
      await updateCoupon(Number(selectedId), payload, imageFile);
      notifySuccess("쿠폰이 수정되었습니다.");
      await loadList();
      await loadDetail(selectedId);
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "수정 실패");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const confirmed = window.confirm(`쿠폰 ID ${selectedId}를 삭제할까요?`);
    if (!confirmed) return;

    setSubmitting(true);
    try {
      await deleteCoupon(Number(selectedId));
      notifySuccess("쿠폰이 삭제되었습니다.");
      setSelectedId("");
      setSelectedDetail(null);
      await loadList();
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "삭제 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="쿠폰 관리"
        description="쿠폰 생성·수정·삭제. 목록에서 선택하면 단건 조회 후 수정 폼에 반영됩니다."
      />

      <div className="space-y-6 p-8">
        <section className="soft-card p-5">
          <div className="flex flex-wrap gap-2">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="이름·설명 검색"
              className="min-w-[240px] flex-1 rounded-lg border border-line px-3 py-2 text-[14px]"
            />
            <PrimaryButton
              type="button"
              className="max-w-[120px]"
              onClick={() => void loadList()}
              disabled={loading}
            >
              조회
            </PrimaryButton>
          </div>

          <p className="mt-3 text-[13px] text-muted">{status}</p>

          <select
            value={selectedId}
            onChange={(event) => {
              const nextId = event.target.value;
              setSelectedId(nextId);
              void loadDetail(nextId);
            }}
            className="mt-3 w-full rounded-lg border border-line px-3 py-2 text-[14px]"
          >
            <option value="">쿠폰 선택</option>
            {coupons.map((coupon) => {
              const id = getCouponId(coupon);
              if (id == null) return null;
              return (
                <option key={id} value={String(id)}>
                  {id} · {coupon.name ?? "이름 없음"}
                </option>
              );
            })}
          </select>

          {selectedId && (
            <div className="mt-3 flex flex-wrap gap-2">
              <PrimaryButton
                type="button"
                variant="outline"
                className="max-w-[160px]"
                onClick={() => void loadDetail(selectedId)}
              >
                다시 조회
              </PrimaryButton>
              <PrimaryButton
                type="button"
                variant="outline"
                className="max-w-[160px] text-red-600"
                onClick={() => void handleDelete()}
                disabled={submitting}
              >
                선택 쿠폰 삭제
              </PrimaryButton>
            </div>
          )}
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <CouponFormPanel
            title="쿠폰 생성"
            imageRequired
            submitting={submitting}
            onSubmit={handleCreate}
          />

          <CouponFormPanel
            title="쿠폰 수정"
            initial={selectedDetail}
            currentImageUrl={
              selectedDetail?.imageUrl ?? selectedDetail?.couponImageUrl
            }
            submitting={submitting}
            onSubmit={handleUpdate}
          />
        </div>
      </div>
    </>
  );
}
