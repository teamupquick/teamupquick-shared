import axios from "axios";
import { toast } from "react-toastify";
import { API_URL, ACCESS_TOKEN } from "@shared/utils/utils";
import type { MilestoneDetailsResponseDto } from "@dto/milestone/response";

/**
 * 里程碑服務 - 處理與里程碑相關的API調用
 */
export default class MilestoneService {
  public static readonly keys = {
    milestones: "milestones",
    milestone: "milestone",
  };

  /**
   * 獲取里程碑詳情
   * @param id 里程碑ID
   * @returns 里程碑詳情
   */
  public static readonly getMilestone = async (
    id: number,
  ): Promise<MilestoneDetailsResponseDto | null> => {
    try {
      const result = await axios.get(`${API_URL}/milestones/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });

      if (result.status !== 200) {
        console.error(
          `[MilestoneService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("獲取里程碑詳情失敗", { type: "error" });
        return null;
      }

      return result.data.data;
    } catch (error) {
      console.error("[MilestoneService] 獲取里程碑詳情失敗:", error);
      console.error("[MilestoneService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });
      toast("獲取里程碑詳情失敗", { type: "error" });
      return null;
    }
  };

  /**
   * 移除里程碑隊長
   * @param projectId 項目ID
   * @param milestoneId 里程碑公開ID (publicId)
   * @returns 更新後的里程碑詳情
   */
  public static readonly removeLeader = async (
    projectId: string,
    milestoneId: string,
  ): Promise<MilestoneDetailsResponseDto | null> => {
    try {
      const result = await axios.put(
        `${API_URL}/projects/${projectId}/milestones/${milestoneId}/leader`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );

      if (result.status !== 200) {
        console.error(
          `[MilestoneService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("移除隊長失敗", { type: "error" });
        return null;
      }

      toast("成功移除隊長", { type: "success", autoClose: 1000 });
      return result.data;
    } catch (error) {
      console.error("[MilestoneService] 移除隊長失敗:", error);
      console.error("[MilestoneService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });
      toast("移除隊長失敗", { type: "error" });
      return null;
    }
  };
}
