import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import type { MilestoneDetailsResponseDto } from "@dto/milestone/response";
import MilestoneService from "@shared/api/milestoneService";

/**
 * 移除里程碑隊長參數
 */
interface RemoveLeaderParams {
  projectId: string;
  milestoneId: string;
}

/**
 * 使用里程碑移除隊長功能的Hook
 * @returns 移除隊長相關的函數和狀態
 */
export const useRemoveLeader = () => {
  const [result, setResult] = useState<MilestoneDetailsResponseDto | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ projectId, milestoneId }: RemoveLeaderParams) => {
      // 清空之前的結果和錯誤
      setResult(null);
      setError(null);

      // 呼叫API移除隊長
      return MilestoneService.removeLeader(projectId, milestoneId);
    },
    onSuccess: (data) => {
      // 將API返回結果保存到狀態
      setResult(data);

      // 無效化相關查詢，使UI重新獲取最新數據
      // 無論有無返回數據，都進行無效化操作

      // 無效化特定里程碑的查詢，使用最後用過的 milestoneId
      queryClient.invalidateQueries({
        queryKey: [MilestoneService.keys.milestone],
      });

      // 無效化里程碑列表查詢
      queryClient.invalidateQueries({
        queryKey: [MilestoneService.keys.milestones],
      });
    },
    onError: (err: Error) => {
      console.error("[useRemoveLeader] 移除隊長失敗:", err);
      setError(err);
    },
  });

  /**
   * 封裝的移除隊長函數
   * @param params 移除隊長參數
   */
  const removeLeader = useCallback(
    async (params: RemoveLeaderParams) => {
      await mutation.mutateAsync(params);
    },
    [mutation],
  );

  return {
    removeLeader,
    result,
    error,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export default useRemoveLeader;
