import type { Priority, Status, ProjectClientType } from "@shared/utils/types";
import type { Range } from "@dto/common";
/**
 * 項目創建/更新請求DTO
 */
export type ProjectRequest = {
  name: string;
  description: string;
  clientType: ProjectClientType;
  clientCompanyUserId: number | null;
  clientCompanyId: number | null;
  categoryId: number | null;
  customCategory: string | null;
  assigneeId: number;
  priority: Priority;
  status: Status;
  budgetedHours: number;
  startDate: Date;
  endDate: Date;
};

/**
 * 專案表單類型 - 用於前端表單處理
 */
export interface ProjectForm {
  name: string;
  budgetedHours: number;
  description: string;
  range: Range;
  clientType: ProjectClientType;
  clientCompanyId: number | null;
  clientCompanyUserId: number | null;
  categoryId: number | null;
  customCategory: string;
  customCategoryDescription: string;
  clientCompanyUser: {
    id: number;
    name: string;
  };
  typeCategory: {
    id: number;
    name: string;
  };
  assignee: string;
  assigneeId: number | null;
  priority: Priority;
  publicId?: string | null;
  status: Status;
}
