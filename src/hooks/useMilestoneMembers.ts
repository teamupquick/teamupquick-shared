import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import MilestoneMemberService from "../api/milestoneMemberService";
import type { MilestoneMember } from "@dto/member/types";

/**
 * 通過里程碑ID獲取成員的Hook
 * @param milestoneId 里程碑ID
 * @param enabled 是否啟用查詢
 * @returns 成員列表和刷新函數
 */
export const useMilestoneMembers = (milestoneId?: number, enabled = true) => {
  const queryClient = useQueryClient();

  const query = useQuery<MilestoneMember[], Error>({
    queryKey: [MilestoneMemberService.keys.milestoneMembers, milestoneId],
    queryFn: async () => {
      if (!milestoneId) {
        return [];
      }

      try {
        const members =
          await MilestoneMemberService.getMilestoneMembers(milestoneId);

        return members;
      } catch (error) {
        console.error("[useMilestoneMembers] 獲取成員列表錯誤:", error);
        console.error("[useMilestoneMembers] 錯誤詳情:", {
          message: (error as Error).message,
          stack: (error as Error).stack?.slice(0, 200),
          name: (error as Error).name,
        });

        // 添加對 axios 錯誤的詳細記錄
        if ((error as any).isAxiosError) {
          console.error("[useMilestoneMembers] Axios 錯誤詳情:", {
            status: (error as any).response?.status,
            statusText: (error as any).response?.statusText,
            data: (error as any).response?.data,
            config: {
              url: (error as any).config?.url,
              method: (error as any).config?.method,
              headers: (error as any).config?.headers,
            },
          });
        }

        toast.error("獲取團隊成員列表失敗");
        throw error;
      }
    },
    enabled: !!milestoneId && enabled,
    staleTime: Infinity, // 永不過期，只依賴手動刷新
    gcTime: 1000 * 60 * 5, // 5分鐘
    retry: 1,
  });

  // 添加手動刷新函數
  const refreshMembers = () => {
    if (milestoneId) {
      return queryClient.invalidateQueries({
        queryKey: [MilestoneMemberService.keys.milestoneMembers, milestoneId],
      });
    }
  };

  return {
    ...query,
    refreshMembers,
  };
};

/**
 * 通過里程碑的公開ID獲取成員的Hook
 * @param publicId 里程碑公開ID
 * @param projectId 項目ID (可選)
 * @param enabled 是否啟用查詢
 * @returns 成員列表
 */
export const useMilestoneMembersByPublicId = (
  publicId?: string,
  projectId?: string,
  enabled = true,
) => {
  return useQuery<MilestoneMember[], Error>({
    queryKey: [
      MilestoneMemberService.keys.milestoneMembersByPublicId,
      publicId,
      projectId,
    ],
    queryFn: async () => {
      if (!publicId) {
        return [];
      }

      try {
        const members =
          await MilestoneMemberService.getMilestoneMembersByPublicId(
            publicId,
            projectId,
          );

        return members;
      } catch (error) {
        console.error(
          "[useMilestoneMembersByPublicId] 獲取成員列表錯誤:",
          error,
        );
        console.error("[useMilestoneMembersByPublicId] 錯誤詳情:", {
          message: (error as Error).message,
          stack: (error as Error).stack?.slice(0, 200),
          name: (error as Error).name,
        });
        toast.error("獲取團隊成員列表失敗");
        throw error;
      }
    },
    enabled: !!publicId && enabled,
    staleTime: 1000 * 60 * 5, // 5分鐘
    gcTime: 1000 * 60 * 10, // 10分鐘
    retry: 1,
  });
};

/**
 * 添加里程碑成員的hook
 * @returns 添加成員的mutation
 */
export function useAddMilestoneMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      milestoneId,
      memberData,
    }: {
      milestoneId: number;
      memberData: {
        userId: number;
        hourlyRate: number;
        roleId: number;
        freelancerId?: number;
        companyUserId?: number;
        companyId?: number;
        message?: string;
      };
    }) => {
      return MilestoneMemberService.addMilestoneMember(milestoneId, memberData);
    },
    onSuccess: (_, { milestoneId }) => {
      queryClient.invalidateQueries({
        queryKey: [MilestoneMemberService.keys.milestoneMembers, milestoneId],
      });
    },
  });
}

/**
 * 更新里程碑成員的hook
 * @returns 更新成員的mutation
 */
export function useUpdateMilestoneMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      milestoneId,
      userId,
      updateData,
    }: {
      milestoneId: number;
      userId: number;
      updateData: Partial<{
        hourlyRate: number;
        roleId: number;
        status: string;
        remark: string;
      }>;
    }) => {
      return MilestoneMemberService.updateMilestoneMember(
        milestoneId,
        userId,
        updateData,
      );
    },
    onSuccess: (_, { milestoneId }) => {
      queryClient.invalidateQueries({
        queryKey: [MilestoneMemberService.keys.milestoneMembers, milestoneId],
      });
    },
  });
}

/**
 * 刪除里程碑成員的hook
 * @returns 刪除成員的mutation
 */
export function useDeleteMilestoneMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      milestoneId,
      userId,
    }: {
      milestoneId: number;
      userId: number;
    }) => {
      return MilestoneMemberService.deleteMilestoneMember(milestoneId, userId);
    },
    onSuccess: (_, { milestoneId }) => {
      queryClient.invalidateQueries({
        queryKey: [MilestoneMemberService.keys.milestoneMembers, milestoneId],
      });
    },
  });
}
