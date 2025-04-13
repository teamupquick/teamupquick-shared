import axios from "axios";
import { toast } from "react-toastify";
import { API_URL, ACCESS_TOKEN } from "@shared/utils/utils";
import type { Task } from "@dto/task/response";
import type { TaskRequest } from "@dto/task/request";
import type { DeletionResponseDto } from "@dto/project/response";

/**
 * 任務服務 - 處理與任務相關的API調用
 */
export default class TaskService {
  public static readonly keys = {
    tasks: "tasks",
    task: "task",
  };

  /**
   * 獲取任務詳情
   * @param id 任務ID
   * @returns 任務詳情
   */
  public static readonly getTask = async (id: number): Promise<Task | null> => {
    try {
      const result = await axios.get(`${API_URL}/tasks/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });

      if (result.status !== 200) {
        console.error(
          `[TaskService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("獲取任務詳情失敗", { type: "error" });
        return null;
      }

      return result.data;
    } catch (error) {
      console.error("[TaskService] 獲取任務詳情失敗:", error);
      console.error("[TaskService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });
      toast("獲取任務詳情失敗", { type: "error" });
      return null;
    }
  };

  /**
   * 根據里程碑 ID 獲取任務列表
   * @param milestoneId 里程碑 ID
   * @returns 任務列表
   */
  public static readonly getTasksByMilestoneId = async (
    milestoneId: number,
  ): Promise<Task[]> => {
    try {
      const result = await axios.get(
        `${API_URL}/milestones/${milestoneId}/tasks`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );

      if (result.status !== 200) {
        console.error(
          `[TaskService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("獲取任務列表失敗", { type: "error" });
        return [];
      }

      return result.data;
    } catch (error) {
      console.error("[TaskService] 獲取任務列表失敗:", error);
      console.error("[TaskService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });
      toast("獲取任務列表失敗", { type: "error" });
      return [];
    }
  };

  /**
   * 創建任務
   * @param milestoneId 里程碑 ID
   * @param taskData 任務數據
   * @returns 創建的任務詳情
   */
  public static readonly createTask = async (
    milestoneId: number,
    taskData: TaskRequest,
  ): Promise<Task | null> => {
    try {
      const result = await axios.post(
        `${API_URL}/milestones/${milestoneId}/tasks`,
        taskData,
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
          `[TaskService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("創建任務失敗", { type: "error" });
        return null;
      }

      toast("任務創建成功", { type: "success", autoClose: 1000 });
      return result.data;
    } catch (error) {
      console.error("[TaskService] 創建任務失敗:", error);
      console.error("[TaskService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });

      // 顯示詳細錯誤信息
      const errorMessage =
        (error as any)?.response?.data?.message || "創建任務失敗";
      toast(errorMessage, { type: "error" });
      return null;
    }
  };

  /**
   * 更新任務
   * @param id 任務ID
   * @param taskData 任務數據
   * @returns 更新後的任務詳情
   */
  public static readonly updateTask = async (
    id: number,
    taskData: TaskRequest,
  ): Promise<Task | null> => {
    try {
      const result = await axios.put(`${API_URL}/tasks/${id}`, taskData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });

      if (result.status !== 200) {
        console.error(
          `[TaskService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("更新任務失敗", { type: "error" });
        return null;
      }

      toast("任務更新成功", { type: "success", autoClose: 1000 });
      return result.data;
    } catch (error) {
      console.error("[TaskService] 更新任務失敗:", error);
      console.error("[TaskService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });

      // 顯示詳細錯誤信息
      const errorMessage =
        (error as any)?.response?.data?.message || "更新任務失敗";
      toast(errorMessage, { type: "error" });
      return null;
    }
  };

  /**
   * 刪除任務
   * @param id 任務ID
   * @returns 刪除操作結果
   */
  public static readonly deleteTask = async (
    id: number,
  ): Promise<DeletionResponseDto | null> => {
    try {
      const result = await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });

      if (result.status !== 200) {
        console.error(
          `[TaskService] 錯誤響應: 狀態碼=${result.status}, 數據=`,
          result.data,
        );
        toast("刪除任務失敗", { type: "error" });
        return null;
      }

      toast("任務刪除成功", { type: "success", autoClose: 1000 });
      return result.data;
    } catch (error) {
      console.error("[TaskService] 刪除任務失敗:", error);
      console.error("[TaskService] 錯誤詳情:", {
        message: (error as any)?.message,
        code: (error as any)?.code,
        response: (error as any)?.response?.data,
        status: (error as any)?.response?.status,
      });
      toast("刪除任務失敗", { type: "error" });
      return null;
    }
  };
}

// 任務請求類型 - 用於向API發送請求
export interface TaskRequestDto extends TaskRequest {}

// 任務響應類型 - 用於API響應
export interface TaskResponseDto extends Task {}
