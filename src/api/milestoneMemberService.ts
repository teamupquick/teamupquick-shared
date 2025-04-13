import axios from "axios";
import { toast } from "react-toastify";
import { API_URL, ACCESS_TOKEN } from "@shared/utils/utils";
import type { MilestoneMember } from "@dto/member/types";

/**
 * 里程碑成員服務 - 處理與里程碑成員相關的API調用
 */
export default class MilestoneMemberService {
  public static readonly keys = {
    milestoneMembers: "milestoneMembers",
    milestoneMembersByPublicId: "milestoneMembersByPublicId",
  };

  /**
   * 獲取里程碑的所有成員
   * @param milestoneId 里程碑ID
   * @returns 成員列表
   */
  public static readonly getMilestoneMembers = async (
    milestoneId: number,
  ): Promise<MilestoneMember[]> => {
    try {
      const result = await axios.get(
        `${API_URL}/milestones/${milestoneId}/members`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );
      if (result.status !== 200) {
        console.error(
          `[MilestoneMemberService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("獲取團隊成員失敗", { type: "error" });
        return [];
      }
      return result.data;
    } catch (error) {
      console.error("[MilestoneMemberService] 獲取成員失敗:", error);
      console.error("[MilestoneMemberService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });
      toast("獲取團隊成員失敗", { type: "error" });
      return [];
    }
  };

  /**
   * 通過公開ID獲取里程碑的所有成員
   * @param publicId 里程碑公開ID
   * @param projectId 項目ID (可選)
   * @returns 成員列表
   */
  public static readonly getMilestoneMembersByPublicId = async (
    publicId: string,
    projectId?: string,
  ): Promise<MilestoneMember[]> => {
    try {
      const url = `${API_URL}/milestones/by-public-id/${publicId}`;

      const result = await axios.get(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });

      if (result.status !== 200) {
        console.error(
          `[MilestoneMemberService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("獲取團隊成員失敗", { type: "error" });
        return [];
      }

      if (result.data && result.data.members) {
        return result.data.members;
      }

      return [];
    } catch (error) {
      console.error(
        "[MilestoneMemberService] 通過publicId獲取成員失敗:",
        error,
      );
      console.error("[MilestoneMemberService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        url: (error as any)?.config?.url,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });
      toast("獲取團隊成員失敗", { type: "error" });
      return [];
    }
  };

  /**
   * 添加里程碑成員
   * @param milestoneId 里程碑ID
   * @param memberData 成員數據
   * @returns 添加的成員數據
   */
  public static readonly addMilestoneMember = async (
    milestoneId: number,
    memberData: {
      userId: number;
      hourlyRate: number;
      roleId: number;
      freelancerId?: number;
      companyUserId?: number;
      companyId?: number;
      message?: string;
    },
  ): Promise<MilestoneMember | null> => {
    try {
      const result = await axios.post(
        `${API_URL}/milestones/${milestoneId}/members`,
        memberData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );

      if (result.status !== 201) {
        toast("添加團隊成員失敗", { type: "error" });
        return null;
      }
      toast("成功添加團隊成員", { type: "success", autoClose: 1000 });
      return result.data;
    } catch (error) {
      console.error("[MilestoneMemberService] 添加成員失敗:", error);
      toast("添加團隊成員失敗", { type: "error" });
      return null;
    }
  };

  /**
   * 更新里程碑成員
   * @param milestoneId 里程碑ID
   * @param userId 用戶ID
   * @param updateData 更新的數據
   * @returns 更新後的成員數據
   */
  public static readonly updateMilestoneMember = async (
    milestoneId: number,
    userId: number,
    updateData: Partial<{
      hourlyRate: number;
      roleId: number;
      status: string;
      remark: string;
      permissionLevel?: string;
    }>,
  ): Promise<MilestoneMember | null> => {
    try {
      // 修改為 PUT 方法
      const result = await axios.put(
        `${API_URL}/milestones/${milestoneId}/members/${userId}`,
        updateData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );

      if (result.status !== 200) {
        console.error(
          `[MilestoneMemberService] 非成功狀態碼: ${result.status}`,
        );
        toast("更新團隊成員失敗", { type: "error" });
        return null;
      }

      toast("成功更新團隊成員", { type: "success", autoClose: 1000 });
      return result.data;
    } catch (error) {
      console.error("[MilestoneMemberService] 更新成員失敗:", error);

      // 添加更多錯誤日誌
      if ((error as any).response) {
        console.error("[MilestoneMemberService] 錯誤響應:", {
          status: (error as any).response.status,
          data: (error as any).response.data,
          headers: (error as any).response.headers,
        });
      }

      console.error(
        "[MilestoneMemberService] 錯誤請求配置:",
        (error as any).config,
      );

      toast("更新團隊成員失敗", { type: "error" });
      return null;
    }
  };

  /**
   * 刪除里程碑成員
   * @param milestoneId 里程碑ID
   * @param userId 用戶ID
   * @returns 刪除操作的結果
   */
  public static readonly deleteMilestoneMember = async (
    milestoneId: number,
    userId: number,
  ): Promise<boolean> => {
    try {
      const result = await axios.delete(
        `${API_URL}/milestones/${milestoneId}/members/${userId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );

      if (result.status !== 200 && result.status !== 204) {
        toast("移除團隊成員失敗", { type: "error" });
        return false;
      }

      toast("成功移除團隊成員", { type: "success", autoClose: 1000 });
      return true;
    } catch (error) {
      console.error("[MilestoneMemberService] 刪除成員失敗:", error);
      toast("移除團隊成員失敗", { type: "error" });
      return false;
    }
  };
}
