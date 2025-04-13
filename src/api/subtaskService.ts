import axios from "axios";
import { toast } from "react-toastify";
import { API_URL, ACCESS_TOKEN } from "@shared/utils/utils";
import type { SubTask } from "@dto/task/response";
import type { SubTaskRequest } from "@dto/task/request";
import type { DeletionResponseDto } from "@dto/project/response";

/**
 * 子任務服務 - 處理與子任務相關的API調用
 */
export default class SubtaskService {
  public static readonly keys = {
    subtasks: "subtasks",
    subtask: "subtask",
  };

  /**
   * 獲取子任務詳情
   * @param id 子任務ID
   * @returns 子任務詳情
   */
  public static readonly getSubtask = async (
    id: number,
  ): Promise<SubTask | null> => {
    try {
      const result = await axios.get(`${API_URL}/sub-tasks/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });

      if (result.status !== 200) {
        console.error(
          `[SubtaskService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("獲取子任務詳情失敗", { type: "error" });
        return null;
      }

      return result.data;
    } catch (error) {
      console.error("[SubtaskService] 獲取子任務詳情失敗:", error);
      console.error("[SubtaskService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });
      toast("獲取子任務詳情失敗", { type: "error" });
      return null;
    }
  };

  /**
   * 添加子任務
   * @param milestoneId 里程碑ID
   * @param taskId 任務ID
   * @param subtaskData 子任務數據
   * @returns 創建的子任務詳情
   */
  public static readonly addSubtask = async (
    milestoneId: number,
    taskId: number,
    subtaskData: SubTaskRequest,
  ) => {
    try {
      const result = await axios.post(
        `${API_URL}/milestones/${milestoneId}/tasks/${taskId}/sub-tasks`,
        subtaskData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );

      if (result.status !== 201) {
        console.error(
          `[SubtaskService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("創建子任務失敗", { type: "error" });
        return null;
      }

      toast("子任務創建成功", { type: "success", autoClose: 1000 });
      return {
        taskId,
        subtaskResp: result.data,
      };
    } catch (error) {
      console.error("[SubtaskService] 創建子任務失敗:", error);
      console.error("[SubtaskService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });

      // 顯示詳細錯誤信息
      const errorMessage =
        (error as any)?.response?.data?.message || "創建子任務失敗";
      toast(errorMessage, { type: "error" });
      return null;
    }
  };

  /**
   * 更新子任務
   * @param id 子任務ID
   * @param subtaskData 子任務數據
   * @returns 更新後的子任務詳情
   */
  public static readonly updateSubtask = async (
    id: number,
    subtaskData: SubTaskRequest,
  ): Promise<SubTask | null> => {
    try {
      const result = await axios.put(
        `${API_URL}/sub-tasks/${id}`,
        subtaskData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );

      if (result.status !== 200) {
        console.error(
          `[SubtaskService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("更新子任務失敗", { type: "error" });
        return null;
      }

      toast("子任務更新成功", { type: "success", autoClose: 1000 });
      return result.data;
    } catch (error) {
      console.error("[SubtaskService] 更新子任務失敗:", error);
      console.error("[SubtaskService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });

      // 顯示詳細錯誤信息
      const errorMessage =
        (error as any)?.response?.data?.message || "更新子任務失敗";
      toast(errorMessage, { type: "error" });
      return null;
    }
  };

  /**
   * 刪除子任務
   * @param id 子任務ID
   * @returns 刪除操作結果
   */
  public static readonly deleteSubtask = async (
    id: number,
  ): Promise<DeletionResponseDto | null> => {
    try {
      const result = await axios.delete(`${API_URL}/sub-tasks/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });

      if (result.status !== 200) {
        console.error(
          `[SubtaskService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("刪除子任務失敗", { type: "error" });
        return null;
      }

      toast("子任務刪除成功", { type: "success", autoClose: 1000 });
      return result.data;
    } catch (error) {
      console.error("[SubtaskService] 刪除子任務失敗:", error);
      console.error("[SubtaskService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });
      toast("刪除子任務失敗", { type: "error" });
      return null;
    }
  };
}

// 子任務請求類型 - 用於向API發送請求
export interface SubTaskRequestDto extends SubTaskRequest {}

// 子任務響應類型 - 用於API響應
export interface SubTaskResponseDto extends SubTask {}
