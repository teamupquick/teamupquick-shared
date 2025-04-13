import { ACCESS_TOKEN, API_URL } from "@shared/utils/utils";
import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";
import { toast } from "react-toastify";
import type {
  LeaderInvitationDetailDto,
  MemberInvitationDetailDto,
  InvitationOperationResponseDto,
  MilestoneLeaderInvitation,
  MilestoneMemberInvitation,
} from "@dto/invitation";
import type { MilestoneInvitationStatus } from "@dto/invitation/common";

// 統一的邀請類型命名空間
export namespace InvitationTypes {
  // 邀請類型
  export type InvitationType = "leader" | "member";

  // 共用的響應類型
  export type DetailResponse<T> = { data: T | null; status?: number };

  // 操作響應類型
  export type OperationResponse = {
    success: boolean;
    invitationDetail: any;
  };

  // 通用邀請基礎屬性
  export interface BaseInvitation {
    id: number;
    publicId: string;
    status: MilestoneInvitationStatus;
    acceptedAt: string | null;
    expiredAt: string | null;
    invitedAt: string;
    removedAt: string | null;
  }

  // 拒絕邀請請求
  export interface RejectRequest {
    publicId: string;
    reason: string;
  }
}

// 不再需要重新導出類型，使用命名空間內的類型
type DetailResponse<T> = InvitationTypes.DetailResponse<T>;
type InvitationType = InvitationTypes.InvitationType;

export default class InvitationService {
  public static readonly keys = {
    leaderInvitationInfo: "leader-invitation-info",
    memberInvitationInfo: "member-invitation-info",
    milestoneLeaderInvitations: "milestone-leader-invitations",
    milestoneMemberInvitations: "milestone-member-invitations",
  };

  /**
   * 通用的 HTTP 請求方法
   * @param config 請求配置
   * @param errorHandler 自定義錯誤處理函數
   */
  private static async request<T>(
    config: AxiosRequestConfig,
    errorHandler?: (error: AxiosError) => void,
  ): Promise<T> {
    try {
      const fullConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
          ...config.headers,
        },
      };

      const response = await axios(fullConfig);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (errorHandler) {
        errorHandler(axiosError);
      } else {
        console.error(
          `API 請求失敗 [${config.method}] ${config.url}:`,
          axiosError,
        );
      }

      throw error;
    }
  }

  /**
   * 獲取邀請詳情的通用方法
   * @param type 邀請類型 (leader/member)
   * @param publicId 邀請的公開ID
   */
  private static async getInvitationDetail<T>(
    type: InvitationType,
    publicId: string,
  ): Promise<DetailResponse<T>> {
    const endpoint =
      type === "leader"
        ? `leader-invitations/${publicId}`
        : `member-invitations/${publicId}`;
    try {
      const result = await this.request<T>({
        method: "GET",
        url: `${API_URL}/${endpoint}`,
      });

      return { data: result };
    } catch (error) {
      const axiosError = error as AxiosError;

      // 特殊情況：領導者邀請的權限錯誤處理
      if (type === "leader" && axiosError?.response?.status === 403) {
        toast("您沒有權限查看此邀請，僅公司管理員可以操作", { type: "error" });
      }

      return { data: null, status: axiosError?.response?.status };
    }
  }

  /**
   * 操作邀請的通用方法 (接受/拒絕)
   * @param type 邀請類型 (leader/member)
   * @param publicId 邀請的公開ID
   * @param action 操作類型 (accept/reject)
   * @param data 可選的請求數據
   */
  private static async operateInvitation(
    type: InvitationType,
    publicId: string,
    action: "accept" | "reject",
    data?: any,
  ): Promise<InvitationOperationResponseDto> {
    const endpoint = `${type}-invitations/${publicId}/${action}`;

    const result = await this.request<any>({
      method: "POST",
      url: `${API_URL}/${endpoint}`,
      data,
    });

    return { success: true, invitationDetail: result };
  }

  /**
   * 獲取邀請列表的通用方法
   * @param type 邀請類型 (leader/member)
   * @param param 參數對象，可以是數字ID或公開ID
   */
  private static async getInvitationList<T>(
    type: InvitationType,
    param: {
      milestoneId?: number;
      milestonePublicId?: string;
      serviceCompanyId?: number;
      companyId?: number;
    },
  ): Promise<T[]> {
    const { milestonePublicId, serviceCompanyId, companyId } = param;
    const typeText = type === "leader" ? "隊長" : "成員";
    let apiUrl = "";

    // 根據不同參數決定API路徑
    if (milestonePublicId) {
      apiUrl = `${API_URL}/${type}-invitations/by-milestone/${milestonePublicId}`;
    } else if (serviceCompanyId && type === "leader") {
      apiUrl = `${API_URL}/leader-invitations/by-service-company/${serviceCompanyId}`;
    } else if (companyId && type === "member") {
      apiUrl = `${API_URL}/member-invitations/by-company/${companyId}`;
    } else {
      console.warn(`【邀請記錄】缺少必要參數`);
      return [];
    }

    try {
      const result = await this.request<any[]>({
        method: "GET",
        url: apiUrl,
      });

      return this.transformInvitationList<T>(result, type);
    } catch (error: any) {
      console.error(
        `【邀請記錄】${typeText}邀請列表獲取失敗:`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * 將 API 返回的邀請數據轉換為前端需要的格式
   * @param data API 返回的數據
   * @param type 邀請類型
   */
  private static transformInvitationList<T>(
    data: any[],
    type: InvitationType,
  ): T[] {
    if (!data || !Array.isArray(data)) return [] as T[];

    return data.map((item) => {
      if (type === "leader") {
        // 將 DTO 轉換為 MilestoneLeaderInvitation 格式
        return {
          __brand: "milestoneLeaderInvitations",
          id: item?.id || 0,
          publicId: item?.publicId || "",
          leader: {
            id: item?.leader?.id || 0,
            name: item?.leader?.name || "",
            priceRate: item?.leader?.priceRate || 0,
            company: item?.leader?.company || {
              id: 0,
              name: "",
              responsibleUser: { id: 0, name: "" },
            },
          },
          status: item?.status || "PENDING_INVITATION",
          leaderRate: item?.leaderRate || 0,
          acceptedAt: item?.acceptedAt || null,
          expiredAt: item?.expiredAt || null,
          invitedAt: item?.invitedAt || new Date().toISOString(),
          removedAt: item?.removedAt || null,
          message: item?.message || "",
          milestone: item?.milestone || null,
        } as unknown as T;
      } else {
        // 將 DTO 轉換為 MilestoneMemberInvitation 格式
        return {
          id: item?.id || 0,
          publicId: item?.publicId || "",
          status: item?.status || "PENDING_INVITATION",
          hourlyRate: item?.hourlyRate || 0,
          roleType: item?.roleType || null,
          user: item?.user || { id: 0, name: "" },
          acceptedAt: item?.acceptedAt || null,
          expiredAt: item?.expiredAt || null,
          invitedAt: item?.invitedAt || new Date().toISOString(),
          removedAt: item?.removedAt || null,
          remark: item?.remark || "",
          inviteeType: item?.inviteeType || "COMPANY_USER",
          milestone: item?.milestone || null,
          company: item?.company || null,
          companyUser: item?.companyUser || null,
          freelancer: item?.freelancer || null,
        } as unknown as T;
      }
    });
  }

  // =========== 公開 API 方法 ============

  /**
   * 獲取里程碑隊長邀請詳情
   */
  public static readonly getLeaderInvitationDetail = async (
    publicId: string,
  ): Promise<DetailResponse<LeaderInvitationDetailDto>> => {
    return this.getInvitationDetail<LeaderInvitationDetailDto>(
      "leader",
      publicId,
    );
  };

  /**
   * 獲取里程碑成員邀請詳情
   */
  public static readonly getMemberInvitationDetail = async (
    publicId: string,
  ): Promise<DetailResponse<MemberInvitationDetailDto>> => {
    return this.getInvitationDetail<MemberInvitationDetailDto>(
      "member",
      publicId,
    );
  };

  /**
   * 接受里程碑隊長邀請
   */
  public static readonly acceptLeaderInvitation = async (
    publicId: string,
  ): Promise<InvitationOperationResponseDto> => {
    return this.operateInvitation("leader", publicId, "accept");
  };

  /**
   * 拒絕里程碑隊長邀請
   */
  public static readonly rejectLeaderInvitation = async (
    request: InvitationTypes.RejectRequest,
  ): Promise<InvitationOperationResponseDto> => {
    return this.operateInvitation("leader", request.publicId, "reject", {
      remark: request.reason,
    });
  };

  /**
   * 接受里程碑成員邀請
   */
  public static readonly acceptMemberInvitation = async (
    publicId: string,
  ): Promise<InvitationOperationResponseDto> => {
    return this.operateInvitation("member", publicId, "accept");
  };

  /**
   * 拒絕里程碑成員邀請
   */
  public static readonly rejectMemberInvitation = async (
    request: InvitationTypes.RejectRequest,
  ): Promise<InvitationOperationResponseDto> => {
    return this.operateInvitation("member", request.publicId, "reject", {
      remark: request.reason,
    });
  };

  /**
   * 獲取里程碑隊長邀請列表 (通過數字ID)
   */
  public static readonly getMilestoneLeaderInvitations = async (
    milestoneId: number,
  ): Promise<MilestoneLeaderInvitation[]> => {
    return this.getInvitationList<MilestoneLeaderInvitation>("leader", {
      milestoneId,
    });
  };

  /**
   * 通過 publicId 獲取里程碑隊長邀請列表
   */
  public static readonly getMilestoneLeaderInvitationsByPublicId = async (
    milestonePublicId: string,
  ): Promise<MilestoneLeaderInvitation[]> => {
    return this.getInvitationList<MilestoneLeaderInvitation>("leader", {
      milestonePublicId,
    });
  };

  /**
   * 獲取服務公司的隊長邀請列表
   */
  public static readonly getServiceCompanyLeaderInvitations = async (
    serviceCompanyId: number,
  ): Promise<MilestoneLeaderInvitation[]> => {
    return this.getInvitationList<MilestoneLeaderInvitation>("leader", {
      serviceCompanyId,
    });
  };

  /**
   * 獲取當前用戶的隊長邀請列表
   */
  public static readonly getMyLeaderInvitations = async (): Promise<
    MilestoneLeaderInvitation[]
  > => {
    try {
      const result = await this.request<any[]>({
        method: "GET",
        url: `${API_URL}/leader-invitations/my-invitations`,
      });
      return this.transformInvitationList<MilestoneLeaderInvitation>(
        result,
        "leader",
      );
    } catch (error) {
      console.error("獲取我的隊長邀請列表失敗", error);
      throw error;
    }
  };

  /**
   * 獲取里程碑成員邀請列表 (通過數字ID)
   */
  public static readonly getMilestoneMemberInvitations = async (
    milestoneId: number,
  ): Promise<MilestoneMemberInvitation[]> => {
    return this.getInvitationList<MilestoneMemberInvitation>("member", {
      milestoneId,
    });
  };

  /**
   * 通過 publicId 獲取里程碑成員邀請列表
   */
  public static readonly getMilestoneMemberInvitationsByPublicId = async (
    milestonePublicId: string,
  ): Promise<MilestoneMemberInvitation[]> => {
    return this.getInvitationList<MilestoneMemberInvitation>("member", {
      milestonePublicId,
    });
  };

  /**
   * 獲取公司的成員邀請列表
   */
  public static readonly getCompanyMemberInvitations = async (
    companyId: number,
  ): Promise<MilestoneMemberInvitation[]> => {
    return this.getInvitationList<MilestoneMemberInvitation>("member", {
      companyId,
    });
  };

  /**
   * 獲取當前用戶的成員邀請列表
   */
  public static readonly getMyMemberInvitations = async (): Promise<
    MilestoneMemberInvitation[]
  > => {
    try {
      const result = await this.request<any[]>({
        method: "GET",
        url: `${API_URL}/member-invitations/my-invitations`,
      });
      return this.transformInvitationList<MilestoneMemberInvitation>(
        result,
        "member",
      );
    } catch (error) {
      console.error("獲取我的成員邀請列表失敗", error);
      throw error;
    }
  };

  /**
   * 獲取用戶的成員邀請列表
   */
  public static readonly getUserMemberInvitations = async (
    userId: number,
  ): Promise<MilestoneMemberInvitation[]> => {
    try {
      const result = await this.request<any[]>({
        method: "GET",
        url: `${API_URL}/member-invitations/by-user/${userId}`,
      });
      return this.transformInvitationList<MilestoneMemberInvitation>(
        result,
        "member",
      );
    } catch (error) {
      console.error(`獲取用戶(${userId})的成員邀請列表失敗`, error);
      throw error;
    }
  };

  /**
   * 創建隊長邀請
   */
  public static readonly createLeaderInvitation = async (
    data: any,
  ): Promise<any> => {
    return this.request<any>({
      method: "POST",
      url: `${API_URL}/leader-invitations`,
      data,
      headers: { "Content-Type": "application/json" },
    });
  };

  /**
   * 創建成員邀請
   */
  public static readonly createMemberInvitation = async (
    data: any,
  ): Promise<any> => {
    return this.request<any>({
      method: "POST",
      url: `${API_URL}/member-invitations`,
      data,
      headers: { "Content-Type": "application/json" },
    });
  };

  /**
   * 更新成員邀請
   */
  public static readonly updateMemberInvitation = async (
    publicId: string,
    data: any,
  ): Promise<any> => {
    try {
      return await this.request<any>({
        method: "PUT",
        url: `${API_URL}/member-invitations/${publicId}`,
        data,
      });
    } catch (error: any) {
      console.error(
        `【邀請記錄】更新成員邀請失敗:`,
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  /**
   * 重新發送成員邀請
   * @param publicId 邀請公開 ID
   */
  public static readonly resendMemberInvitation = async (
    publicId: string,
  ): Promise<any> => {
    try {
      return await this.request<any>({
        method: "POST",
        url: `${API_URL}/member-invitations/${publicId}/resend`,
      });
    } catch (error: any) {
      console.error(
        `【邀請記錄】重新發送成員邀請失敗:`,
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  /**
   * 取消成員邀請
   * @param publicId 邀請公開 ID
   */
  public static readonly cancelMemberInvitation = async (
    publicId: string,
  ): Promise<any> => {
    try {
      return await this.request<any>({
        method: "PUT",
        url: `${API_URL}/member-invitations/${publicId}`,
        data: {
          status: "INVITATION_CANCELED",
        },
      });
    } catch (error: any) {
      console.error(
        `【邀請記錄】取消成員邀請失敗:`,
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  /**
   * 接受邀請並加入團隊
   * @param publicId 邀請公開 ID
   */
  public static readonly joinTeamMemberInvitation = async (
    publicId: string,
  ): Promise<any> => {
    try {
      return await this.request<any>({
        method: "POST",
        url: `${API_URL}/member-invitations/${publicId}/join-team`,
      });
    } catch (error: any) {
      console.error(
        `【邀請記錄】加入團隊失敗:`,
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  /**
   * 發送邀請
   */
  static async sendInvitation(data: any): Promise<void> {
    await this.request<void>({
      method: "POST",
      url: `${API_URL}/invitations`,
      data,
      headers: { "Content-Type": "application/json" },
    });
  }
}
