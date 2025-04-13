import type { Assignee, Priority, Status, MilestoneLeader } from "@shared/utils/types";
import type { Task } from "@dto/task/response";
import type { MilestoneInvitationStatus } from "@dto/invitation/common";
import type { CompanyUserDto } from "@dto/user";
import type { MilestoneMember } from "@dto/member/types";
import type {
  MilestoneFormLeader,
  MilestoneFormMember,
  SimpleMilestoneFormMember,
} from "./request";
import type { Range } from "@dto/common";
/**
 * 里程碑基本响应DTO
 */
export interface MilestoneResponseDto {
  id: number;
  publicId: string;
  name: string;
  description: string;
  projectId: number;
  assignee: Assignee;
  assigneeId: number;
  priority: Priority;
  status: Status;
  budgetedHours: number;
  categoryId?: number;
  leaderId?: number;
  leaderRate: number;
  startDate?: string;
  endDate?: string;
  clientCompanyUserId?: number;
  customCategory?: string;
}

/**
 * 專案簡化資訊
 */
export interface ProjectSimpleInfo {
  id: number;
  name: string;
  publicId: string;
}

/**
 * 類別簡化資訊
 */
export interface CategorySimpleInfo {
  id: number;
  name: string;
}

/**
 * 里程碑詳情響應DTO
 */
export interface MilestoneDetailsResponseDto {
  project: {
    id: number;
    name: string;
    publicId: string;
  };
  leader?: {
    id: number;
    name: string;
  };
  hoursSpent: number;
  cost: number;
  typeCategory?: {
    id: number;
    name: string;
  } | null;
  version: number;
  clientCompanyUser?: CompanyUserDto | null;
  members?: MilestoneMember[];
  tasks?: any[];
  id: number;
  publicId: string;
  name: string;
  description: string;
  projectId: number;
  assignee: Assignee;
  assigneeId: number;
  priority: Priority;
  status: Status;
  budgetedHours: number;
  categoryId?: number;
  leaderId?: number;
  leaderRate: number;
  startDate?: string;
  endDate?: string;
  clientCompanyUserId?: number;
  customCategory?: string;
}

/**
 * 完整里程碑數據結構
 */
export type Milestone = {
  __brand: "milestone";
  id: number;
  publicId: string;
  tasks: Task[];
  name: string;
  version: number;
  categoryId: number;
  assigneeId: number;
  creatorId: number;
  customCategory: string | undefined;
  assignee: Assignee;
  priority: Priority;
  status: Status;
  budgetedHours: number; //TODO: rename after BE update
  startDate: string;
  endDate: string;
  description: string;
  members: MilestoneMember[];
  hoursSpent: number;
  leader: MilestoneLeader;
  leaderRate: number;
  cost: number;
  clientCompanyUserId: number;
  leaderStatus: MilestoneInvitationStatus;
  typeCategory?: { id: number; name: string } | null;
  clientCompanyUser?: { id: number; name: string } | null;
};

/**
 * 里程碑表單數據
 */
export type MilestoneForm = Omit<MilestoneFormLeader, "leaderStatus"> & {
  id?: number;
  name: string;
  version: string;
  customCategory: string | undefined;
  priority: Priority;
  status: Status;
  assigneeId: string;
  assigneeUserId?: number | null;
  clientCompanyUserId?: number | null;
  members: (MilestoneFormMember | SimpleMilestoneFormMember)[];
  categoryId?: number | null;
  budgetedHours: string;
  description: string;
  leaderId?: number | null;
  leaderRate?: number | null;
  publicId?: string | null;
  projectCategoryId?: number | null;
  range: Range;
};
