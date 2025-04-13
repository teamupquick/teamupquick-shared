import type { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import InvitationService from "@shared/api/invitationService";
import type {
  MilestoneLeaderInvitation,
  MilestoneMemberInvitation,
} from "@dto/invitation";
import type {
  LeaderInvitationDetailDto,
  MemberInvitationDetailDto,
} from "@dto/invitation";
import { InviteeType } from "@dto/roleType";

// 共用的類型定義
type InvitationType = "leader" | "member";
type InvitationError = {
  message: string;
  status?: number;
};

// 錯誤狀態碼映射
type ErrorStatusMap = Record<number, string>;

/**
 * 處理邀請相關的錯誤
 * @param error API 錯誤
 * @param customMessages 自定義錯誤訊息
 */
const handleInvitationError = (
  error: AxiosError,
  customMessages?: ErrorStatusMap,
) => {
  // 默認錯誤訊息
  const defaultMessages: ErrorStatusMap = {
    400: "請求格式有誤，請檢查輸入資料",
    401: "無效的連結或權限不足，請重新登入或確認連結內容",
    403: "無權操作此邀請，請聯繫管理員或確認連結內容",
    404: "邀請不存在，請確認連結是否正確",
    409: "邀請已失效或狀態已變更，若此情況非預期，請洽專案負責人",
    410: "邀請已過期或已被撤銷，若此情況非預期，請洽專案負責人",
    500: "伺服器處理請求時發生錯誤，請稍後再試",
  };

  // 合併默認訊息和自定義訊息
  const messages = { ...defaultMessages, ...customMessages };

  const status = error?.response?.status;
  const errorData = error?.response?.data as any;
  const errorMessage = errorData?.message || error?.message;

  // 紀錄詳細錯誤信息
  console.error("【邀請錯誤處理】詳細錯誤信息:", {
    status,
    errorMessage,
    errorData,
  });

  if (status && status in messages) {
    toast(messages[status], { type: "error" });
  } else if (errorMessage) {
    // 顯示後端返回的錯誤訊息
    toast(`操作失敗: ${errorMessage}`, { type: "error" });
  } else {
    toast("操作失敗，請稍後再試", { type: "error" });
  }
};

/**
 * 統一版本的里程碑邀請列表獲取 Hook
 * 僅支持通過 publicId 獲取隊長或成員邀請列表
 */
export function useMilestoneInvitationsList<
  T extends MilestoneLeaderInvitation | MilestoneMemberInvitation,
>({
  milestonePublicId,
  type = "leader",
  enabled = true,
}: {
  milestonePublicId: string;
  type?: InvitationType;
  enabled?: boolean;
}) {
  return useQuery<T[], Error>({
    queryKey: [
      type === "leader"
        ? "milestone-leader-invitations"
        : "milestone-member-invitations",
      milestonePublicId,
    ],
    queryFn: async () => {
      // 檢查參數有效性
      if (!milestonePublicId) {
        console.warn(
          `【查詢】缺少必要參數，無法獲取${type === "leader" ? "隊長" : "成員"}邀請列表`,
        );
        return [];
      }

      try {
        const result =
          type === "leader"
            ? await InvitationService.getMilestoneLeaderInvitationsByPublicId(
                milestonePublicId,
              )
            : await InvitationService.getMilestoneMemberInvitationsByPublicId(
                milestonePublicId,
              );

        return result as unknown as T[];
      } catch (error) {
        console.error(
          `【查詢】獲取${type === "leader" ? "隊長" : "成員"}邀請列表失敗:`,
          error,
        );
        throw error;
      }
    },
    enabled: enabled && !!milestonePublicId,
    staleTime: 0, // 確保數據總是最新的
  });
}

/**
 * 獲取里程碑隊長邀請列表 (通過publicId)
 */
export function useMilestoneLeaderInvitationsList({
  milestonePublicId,
  enabled = true,
}: {
  milestonePublicId: string;
  enabled?: boolean;
}) {
  return useMilestoneInvitationsList<MilestoneLeaderInvitation>({
    milestonePublicId,
    type: "leader",
    enabled,
  });
}

/**
 * 獲取里程碑成員邀請列表 (通過publicId)
 */
export function useMilestoneMemberInvitationsList({
  milestonePublicId,
  enabled = true,
}: {
  milestonePublicId: string;
  enabled?: boolean;
}) {
  return useMilestoneInvitationsList<MilestoneMemberInvitation>({
    milestonePublicId,
    type: "member",
    enabled,
  });
}

/**
 * 獲取服務公司的隊長邀請列表
 */
export function useServiceCompanyLeaderInvitations({
  serviceCompanyId,
  enabled = true,
}: {
  serviceCompanyId: number;
  enabled?: boolean;
}) {
  return useQuery<MilestoneLeaderInvitation[], Error>({
    queryKey: ["service-company-leader-invitations", serviceCompanyId],
    queryFn: async () => {
      try {
        const result =
          await InvitationService.getServiceCompanyLeaderInvitations(
            serviceCompanyId,
          );

        return result;
      } catch (error) {
        console.error(
          `【查詢】獲取服務公司(${serviceCompanyId})的隊長邀請列表失敗:`,
          error,
        );
        throw error;
      }
    },
    enabled: enabled && !!serviceCompanyId,
    staleTime: 0,
  });
}

/**
 * 獲取當前用戶的隊長邀請列表
 */
export function useMyLeaderInvitations({
  enabled = true,
}: { enabled?: boolean } = {}) {
  return useQuery<MilestoneLeaderInvitation[], Error>({
    queryKey: ["my-leader-invitations"],
    queryFn: async () => {
      try {
        const result = await InvitationService.getMyLeaderInvitations();

        return result;
      } catch (error) {
        console.error("【查詢】獲取我的隊長邀請列表失敗:", error);
        throw error;
      }
    },
    enabled,
    staleTime: 0,
  });
}

/**
 * 獲取公司的成員邀請列表
 */
export function useCompanyMemberInvitations({
  companyId,
  enabled = true,
}: {
  companyId: number;
  enabled?: boolean;
}) {
  return useQuery<MilestoneMemberInvitation[], Error>({
    queryKey: ["company-member-invitations", companyId],
    queryFn: async () => {
      try {
        const result =
          await InvitationService.getCompanyMemberInvitations(companyId);

        return result;
      } catch (error) {
        console.error(
          `【查詢】獲取公司(${companyId})的成員邀請列表失敗:`,
          error,
        );
        throw error;
      }
    },
    enabled: enabled && !!companyId,
    staleTime: 0,
  });
}

/**
 * 獲取當前用戶的成員邀請列表
 */
export function useMyMemberInvitations({
  enabled = true,
}: { enabled?: boolean } = {}) {
  return useQuery<MilestoneMemberInvitation[], Error>({
    queryKey: ["my-member-invitations"],
    queryFn: async () => {
      try {
        const result = await InvitationService.getMyMemberInvitations();

        return result;
      } catch (error) {
        console.error("【查詢】獲取我的成員邀請列表失敗:", error);
        throw error;
      }
    },
    enabled,
    staleTime: 0,
  });
}

/**
 * 獲取用戶的成員邀請列表
 */
export function useUserMemberInvitations({
  userId,
  enabled = true,
}: {
  userId: number;
  enabled?: boolean;
}) {
  return useQuery<MilestoneMemberInvitation[], Error>({
    queryKey: ["user-member-invitations", userId],
    queryFn: async () => {
      try {
        const result = await InvitationService.getUserMemberInvitations(userId);

        return result;
      } catch (error) {
        console.error(`【查詢】獲取用戶(${userId})的成員邀請列表失敗:`, error);
        throw error;
      }
    },
    enabled: enabled && !!userId,
    staleTime: 0,
  });
}

/**
 * 創建成員邀請
 */
export function useCreateMemberInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      // 檢查必填欄位
      if (!data.hourlyRate) {
        throw new Error("時薪不能為空");
      }
      if (!data.roleId) {
        throw new Error("角色不能為空");
      }
      if (!data.inviteeType) {
        throw new Error("邀請類型不能為空");
      }
      if (data.inviteeType === "FREELANCER") {
        if (!data.freelancerId) {
          throw new Error("自由工作者邀請必須指定自由工作者ID");
        }
      } else if (!data.companyId && !data.userId) {
        throw new Error("公司用戶邀請必須指定公司或用戶");
      }

      return InvitationService.createMemberInvitation(data);
    },
    onSuccess: (result) => {
      toast("成功創建成員邀請", { type: "success", autoClose: 1000 });

      // 更新相關查詢緩存
      if (result?.milestone?.publicId) {
        queryClient.invalidateQueries({
          queryKey: ["milestone-member-invitations", result.milestone.publicId],
        });
      } else {
        // 若沒有明確的 publicId，則清除所有成員邀請列表緩存
        queryClient.invalidateQueries({
          queryKey: ["milestone-member-invitations"],
        });
      }

      if (result?.company?.id) {
        queryClient.invalidateQueries({
          queryKey: ["company-member-invitations", result.company.id],
        });
      }

      // 同時清除其他相關緩存，確保數據一致性
      queryClient.invalidateQueries({
        queryKey: ["my-member-invitations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-member-invitations"],
      });

      if (result?.publicId) {
        queryClient.invalidateQueries({
          queryKey: [
            InvitationService.keys.memberInvitationInfo,
            result.publicId,
          ],
        });
      }
    },
    onError: (error: AxiosError) => {
      console.error("【創建成員邀請】創建失敗", error);
      handleInvitationError(error, {
        400: "創建邀請失敗，請檢查輸入資料是否完整",
        404: "找不到指定的里程碑或用戶，請確認資料正確性",
        409: "該用戶已收到此里程碑邀請，請勿重複邀請",
      });
    },
  });
}

/**
 * 更新成員邀請
 */
export function useUpdateMemberInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ publicId, data }: { publicId: string; data: any }) => {
      if (!publicId) {
        throw new Error("邀請ID不能為空");
      }

      return InvitationService.updateMemberInvitation(publicId, data);
    },
    onSuccess: (result) => {
      toast("成功更新成員邀請", { type: "success", autoClose: 1000 });

      // 更新相關查詢緩存
      queryClient.invalidateQueries({
        queryKey: [
          InvitationService.keys.memberInvitationInfo,
          result?.publicId,
        ],
      });
      if (result?.milestone?.id) {
        queryClient.invalidateQueries({
          queryKey: ["milestone-member-invitations"],
        });
      }
      if (result?.company?.id) {
        queryClient.invalidateQueries({
          queryKey: ["company-member-invitations", result.company.id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["my-member-invitations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-member-invitations"],
      });
    },
    onError: (error: AxiosError) => {
      console.error("【更新成員邀請】更新失敗", error);
      handleInvitationError(error, {
        400: "更新邀請失敗，請檢查輸入資料是否完整",
        404: "找不到指定的邀請記錄",
        409: "邀請狀態已變更，無法進行此操作",
      });
    },
  });
}

/**
 * 發送邀請
 */
export function useSendInvitation() {
  return useMutation({
    mutationFn: (data: any) => {
      return InvitationService.sendInvitation(data);
    },
    onSuccess: () => {
      toast("成功發送邀請", { type: "success", autoClose: 1000 });
    },
    onError: (error: AxiosError) => {
      handleInvitationError(error);
    },
  });
}

/**
 * 通用的邀請操作 Hook
 * @param publicId 邀請的公開ID
 * @param type 邀請類型 (leader/member)
 */
function useInvitationAction<T extends "leader" | "member">(
  publicId: string,
  type: T,
) {
  const queryClient = useQueryClient();

  type InvitationDetailType = T extends "leader"
    ? { data: LeaderInvitationDetailDto | null; status?: number }
    : { data: MemberInvitationDetailDto | null; status?: number };

  // 獲取邀請詳情
  const { data: invitationInfo } = useQuery<InvitationDetailType>({
    queryKey: [
      type === "leader"
        ? InvitationService.keys.leaderInvitationInfo
        : InvitationService.keys.memberInvitationInfo,
      publicId,
    ],
    queryFn: async () => {
      let result;
      if (type === "leader") {
        result = await InvitationService.getLeaderInvitationDetail(publicId);
      } else {
        result = await InvitationService.getMemberInvitationDetail(publicId);
      }

      return result as unknown as InvitationDetailType;
    },
    enabled: !!publicId,
  });

  // 接受邀請
  const acceptInvitationMutation = useMutation({
    mutationFn: () => {
      if (!publicId) {
        throw new Error("邀請ID不能為空");
      }

      if (type === "leader") {
        return InvitationService.acceptLeaderInvitation(publicId);
      } else {
        return InvitationService.acceptMemberInvitation(publicId);
      }
    },
    onSuccess: (result) => {
      toast("成功加入里程碑", { type: "success", autoClose: 1000 });

      // 清除緩存數據，確保下次讀取時重新獲取
      invalidateRelevantQueries();
    },
    onError: (error: AxiosError) => {
      console.error(`【接受邀請】接受 ${type} 邀請失敗`, error);
      handleInvitationError(error);
    },
  });

  // 拒絕邀請
  const rejectInvitationMutation = useMutation({
    mutationFn: (reason: string) => {
      if (!publicId) {
        throw new Error("邀請ID不能為空");
      }
      if (!reason || reason.trim() === "") {
        throw new Error("拒絕原因不能為空");
      }
      if (type === "leader") {
        return InvitationService.rejectLeaderInvitation({ publicId, reason });
      } else {
        return InvitationService.rejectMemberInvitation({ publicId, reason });
      }
    },
    onSuccess: (result) => {
      toast("成功拒絕邀請", { type: "success", autoClose: 1000 });

      // 清除緩存數據，確保下次讀取時重新獲取
      invalidateRelevantQueries();
    },
    onError: (error: AxiosError) => {
      console.error(`【拒絕邀請】拒絕 ${type} 邀請失敗`, error);
      handleInvitationError(error);
    },
  });

  // 輔助函數：使相關查詢失效
  function invalidateRelevantQueries() {
    const keyPrefix = type === "leader" ? "leader" : "member";

    // 使特定邀請的詳情查詢失效
    queryClient.invalidateQueries({
      queryKey: [
        type === "leader"
          ? InvitationService.keys.leaderInvitationInfo
          : InvitationService.keys.memberInvitationInfo,
        publicId,
      ],
    });

    // 使所有相關列表查詢失效
    queryClient.invalidateQueries({
      queryKey: [`my-${keyPrefix}-invitations`],
    });
    queryClient.invalidateQueries({
      queryKey: [`user-${keyPrefix}-invitations`],
    });
    queryClient.invalidateQueries({
      queryKey: [
        type === "leader"
          ? "milestone-leader-invitations"
          : "milestone-member-invitations",
      ],
    });
    // 額外更新公司和里程碑相關的查詢
    if (type === "leader") {
      queryClient.invalidateQueries({
        queryKey: ["service-company-leader-invitations"],
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ["company-member-invitations"],
      });
    }
  }

  return {
    invitationInfo,
    acceptInvitation: acceptInvitationMutation.mutate,
    rejectInvitation: rejectInvitationMutation.mutate,
    isAccepting: acceptInvitationMutation.isPending,
    isRejecting: rejectInvitationMutation.isPending,
    error: acceptInvitationMutation.error || rejectInvitationMutation.error,
  };
}

/**
 * 處理里程碑隊長邀請動作 (接受/拒絕)
 * @param publicId 邀請公開ID
 */
export const useInvitationLeaderAction = (publicId: string) => {
  return useInvitationAction(publicId, "leader");
};

/**
 * 處理里程碑成員邀請動作 (接受/拒絕)
 * @param publicId 邀請公開ID
 */
export const useInvitationMemberAction = (publicId: string) => {
  return useInvitationAction(publicId, "member");
};
