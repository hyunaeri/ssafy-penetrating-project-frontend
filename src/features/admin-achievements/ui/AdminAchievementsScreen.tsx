"use client";

import { useCallback, useEffect, useState } from "react";
import type { AchievementResponse } from "@/entities/admin-achievement";
import {
  createAchievement,
  deleteAchievement,
  fetchAchievements,
  getAchievementId,
  updateAchievement,
} from "@/entities/admin-achievement";
import { AdminPageHeader, extractArray } from "@/features/admin-shared";
import { AchievementFormPanel } from "@/features/admin-achievements/ui/AchievementFormPanel";
import { PrimaryButton, notifyError, notifySuccess } from "@/shared/ui";

export function AdminAchievementsScreen() {
  const [keyword, setKeyword] = useState("");
  const [achievements, setAchievements] = useState<AchievementResponse[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const selected = achievements.find(
    (item) => String(getAchievementId(item)) === selectedId
  );

  const loadList = useCallback(async (nextKeyword = keyword) => {
    setLoading(true);
    setStatus("업적 목록을 불러오는 중입니다.");

    try {
      const body = await fetchAchievements(nextKeyword);
      const list = extractArray<AchievementResponse>(body, ["achievements"]);
      setAchievements(list);
      setStatus(`업적 ${list.length}개를 불러왔습니다.`);
    } catch (error) {
      setAchievements([]);
      const message = error instanceof Error ? error.message : "조회 실패";
      setStatus(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    void loadList("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (
    payload: Parameters<typeof createAchievement>[0],
    imageFile: File | null
  ) => {
    if (!imageFile) return;
    setSubmitting(true);
    try {
      await createAchievement(payload, imageFile);
      notifySuccess("업적이 생성되었습니다.");
      await loadList();
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "생성 실패");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (
    payload: Parameters<typeof updateAchievement>[1],
    imageFile: File | null
  ) => {
    if (!selectedId) return;
    setSubmitting(true);
    try {
      await updateAchievement(Number(selectedId), payload, imageFile);
      notifySuccess("업적이 수정되었습니다.");
      await loadList();
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "수정 실패");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const confirmed = window.confirm(`업적 ID ${selectedId}를 삭제할까요?`);
    if (!confirmed) return;

    setSubmitting(true);
    try {
      await deleteAchievement(Number(selectedId));
      notifySuccess("업적이 삭제되었습니다.");
      setSelectedId("");
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
        title="업적 관리"
        description="업적 생성·수정·삭제. 목록에서 선택하면 수정 폼에 반영됩니다."
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
            onChange={(event) => setSelectedId(event.target.value)}
            className="mt-3 w-full rounded-lg border border-line px-3 py-2 text-[14px]"
          >
            <option value="">업적 선택</option>
            {achievements.map((achievement) => {
              const id = getAchievementId(achievement);
              if (id == null) return null;
              return (
                <option key={id} value={String(id)}>
                  {id} · {achievement.name ?? "이름 없음"}
                </option>
              );
            })}
          </select>

          {selectedId && (
            <div className="mt-3">
              <PrimaryButton
                type="button"
                variant="outline"
                className="max-w-[160px] text-red-600"
                onClick={() => void handleDelete()}
                disabled={submitting}
              >
                선택 업적 삭제
              </PrimaryButton>
            </div>
          )}
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <AchievementFormPanel
            title="업적 생성"
            imageRequired
            submitting={submitting}
            onSubmit={handleCreate}
          />

          <AchievementFormPanel
            title="업적 수정"
            initial={selected ?? null}
            currentImageUrl={selected?.imageUrl}
            submitting={submitting}
            onSubmit={handleUpdate}
          />
        </div>
      </div>
    </>
  );
}
