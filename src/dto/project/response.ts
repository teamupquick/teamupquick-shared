import type { Priority, ProjectClientType, Status } from "@shared/utils/types";
import type { Milestone } from "@dto/milestone/response";
import type { Assignee } from "@shared/utils/types";
/**
 * 項目列表響應DTO
 */
export interface ProjectListItemDto {
  id: number;
  publicId: string;
  name: string;
  clientType: ProjectClientType;
  description: string;
  status: Status;
  priority: Priority;
  budgetedHours: number;
  assignee: { id: number; name: string };
  startDate: string;
  endDate: string;
  typeCategory: { id: number; name: string } | null;
  clientCompany: { id: number; name: string } | null;
  clientCompanyUser: { id: number; name: string } | null;
}

/**
 * 刪除操作響應DTO
 */
export interface DeletionResponseDto {
  success: boolean;
  message: string;
}

export type Project = {
  __brand: "project";
  id: number;
  publicId: string;
  milestones: Milestone[];
  name: string;
  description: string;
  creatorId: number;
  clientCompanyId: number | null;
  customCategory: string | null;
  clientType: ProjectClientType;
  clientCompanyUser: Assignee;
  assignee: Assignee;
  priority: Priority;
  status: Status;
  budgetedHours: number; //TODO: rename after BE update
  hoursSpent: number;
  startDate: string;
  endDate: string;
  cost: number;
  categoryId: number | null;
  typeCategory?: { id: number; name: string } | null;
};
