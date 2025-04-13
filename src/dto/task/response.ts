import type { Priority, Status, Subtask } from "@shared/utils/types";
import type { MilestoneMember } from "@dto/member/types";
import type { TypeCategory } from "@dto/typeCategory";
/**
 * 任務響應 DTO
 */
export interface TaskResponseDto {
  /**
   * 任務 ID
   */
  id: number;

  /**
   * 公開 ID
   */
  publicId?: string;

  /**
   * 任務名稱
   */
  name: string;

  /**
   * 任務描述
   */
  description: string;

  /**
   * 里程碑 ID
   */
  milestoneId: number;

  /**
   * 執行者 (里程碑成員)
   */
  assignee: MilestoneMember;

  /**
   * 創建者 ID
   */
  creatorId: number;

  /**
   * 類別 ID
   */
  categoryId?: number;
  category?: TypeCategory;
  /**
   * 優先級
   */
  priority: Priority;

  /**
   * 狀態
   */
  status: Status;

  /**
   * 總預算時數
   */
  budgetedHours: number;

  /**
   * 服務費用
   */
  serviceFee: number;

  /**
   * 總預算
   */
  budget: number;

  /**
   * 總成本
   */
  cost: number;

  /**
   * 花費時數
   */
  hoursSpent: number;

  /**
   * 開始日期
   */
  startDate?: string;

  /**
   * 結束日期
   */
  endDate?: string;

  /**
   * 版本
   */
  version: number;

  /**
   * 創建時間
   */
  createdAt: string;

  /**
   * 更新時間
   */
  updatedAt: string;

}
export type Task = {
  __brand: "task";
  id: number;
  name: string;
  description: string;
  subTasks: Subtask[];
  typeCategory: TypeCategory;
  assignee: MilestoneMember;
  creatorId: number;
  priority: Priority;
  status: Status;
  budgetedHours: number;
  cost: number;
  hoursSpent: number;
  startDate: string;
  endDate: string;
  version: number;

  // DTO額外字段
  publicId?: string;
  milestoneId?: number;
  categoryId?: number;
  serviceFee?: number;
  budget?: number;
  createdAt?: string;
  updatedAt?: string;
};
/**
 * 子任務響應 DTO
 */
export interface SubTask {
  /**
   * 子任務 ID
   */
  id: number;

  /**
   * 任務 ID
   */
  taskId: number;

  /**
   * 子任務名稱
   */
  name: string;

  /**
   * 子任務描述
   */
  description: string;

  /**
   * 執行者
   */
  assignee: MilestoneMember;

  /**
   * 創建者 ID
   */
  creatorId: number;

  /**
   * 類別 ID
   */
  categoryId?: number;

  /**
   * 開始時間
   */
  startTime?: string;

  /**
   * 結束時間
   */
  endTime?: string;

  /**
   * 成本
   */
  cost: number;

  /**
   * 花費時數
   */
  hoursSpent: number;

  /**
   * 版本
   */
  version: number;

  /**
   * 創建時間
   */
  createdAt: string;

  /**
   * 更新時間
   */
  updatedAt: string;
}
