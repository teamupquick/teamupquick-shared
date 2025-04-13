import type { Priority, Status } from "@shared/utils/types";
import type { Range } from "@dto/common";
import type { TypeCategory } from "@dto/typeCategory";

/**
 * 任務表單類型
 */
export interface TaskForm {
  name: string;
  version: string;
  category: string | TypeCategory;
  customCategory?: string;
  priority: Priority;
  status: Status;
  assigneeId: string;
  assigneeUserId?: number;
  budgetedHours: string;
  description: string;
  range: Range;
  categoryId?: number;
  [key: string]: any;
}

/**
 * 子任務表單類型
 */
export interface SubtaskForm {
  name: string;
  version: string;
  category: string | TypeCategory;
  assigneeId: string;
  startTime: string | null;
  endTime: string | null;
  description: string;
  categoryId?: number;
  customCategory?: string;
}
