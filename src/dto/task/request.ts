import type { Priority, Status } from "@shared/utils/types";

/**
 * 任務請求DTO
 */
export interface TaskRequest {
  /**
   * 任務名稱
   */
  name: string;

  /**
   * 任務描述
   */
  description: string;

  /**
   * 執行者 ID（里程碑成員 ID）
   */
  assigneeId: number;

  /**
   * 類別 ID
   */
  categoryId?: number;

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
  serviceFee?: number;

  /**
   * 總預算
   */
  budget?: number;

  /**
   * 總成本
   */
  cost?: number;

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
  version?: number;
}

/**
 * 子任務請求 DTO
 */
export interface SubTaskRequest {
  /**
   * 子任務名稱
   */
  name: string;

  /**
   * 子任務描述
   */
  description: string;

  /**
   * 執行者 ID
   */
  assigneeId: number;

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
  cost?: number;

  /**
   * 服務費用
   */
  serviceFee?: number;

  /**
   * 工時時長
   */
  duration?: number;

  /**
   * 預算
   */
  budget?: number;

  /**
   * 版本
   */
  version?: number;
}
