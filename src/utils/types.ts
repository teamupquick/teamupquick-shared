// import type { RoleType } from "@prisma/client";
import type { User } from "@shared/api/userService";
import type { RoleTypeDto, InviteeType } from "@dto/roleType";
import type { MilestoneInvitationStatus } from "@dto/invitation/common";
import type { TypeCategory } from "@dto/typeCategory";
import type { Task as TaskType } from "@dto/task/response";
import type { Milestone as MilestoneType } from "@dto/milestone/response";
import type { Project as ProjectType } from "@dto/project/response";
import type { CompanyUser } from "@dto/member";
import type { Freelancer } from "@shared/api/freelancerService";
export type RoleType = string;

export type Role = "USER" | "COMPANY_USER" | "PM" | "ADMIN";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type ProjectClientType = "USER" | "COMPANY";
export type Status =
  | "PREPARATION"
  | "WAITING"
  | "IN_PROGRESS"
  | "PENDING"
  | "COMPLETED"
  | "CLOSED"
  | "CANCELED"
  | "PENDING_EXECUTION"
  | "PENDING_CLOSURE";

// 重新導出這些類型以便於其他模塊使用
export type Task = TaskType;
export type Milestone = MilestoneType;
export type Project = ProjectType;

// 為向後兼容性保留，現在引用 RoleType 字符串值
export type MilestoneMemberRole = string;

// 定義里程碑成員，兼容現有代碼
export type MilestoneMember = {
  id: number;
  user: Pick<User, "id" | "name">;
  hourlyRate: number;
  role: RoleType;
  status: MilestoneInvitationStatus;
  roletypeId?: number;
  roletype?: RoleTypeDto;
  ndaTemplateId?: number | null;
  freelancerId?: number | null;
  companyUser?: CompanyUser;
  freelancer?: Freelancer;
  representingCompanyId?: number | null;
  companyUserId?: number | null;
  inviteeType?: InviteeType;
  message?: string;
  // 可能需要的DTO兼容字段
  userId?: number;
  roleId?: number;
  type?: string;
};

export type MilestoneLeader = {
  id: number;
  name: string;
};

/**
 * 擴展Task類型，整合DTO與當前系統
 * 此處不使用extends，而是直接定義所有需要的屬性
 */

/**
 * 擴展Subtask類型，整合DTO與當前系統
 * 此處不使用extends，而是直接定義所有需要的屬性
 */
export type Subtask = {
  __brand: "subTask";
  id: number;
  name: string;
  description: string;
  category: TypeCategory;
  customCategory: string | null;
  assignee: MilestoneMember;
  creatorId: number;
  cost: number;
  hoursSpent: number;
  startTime: string;
  endTime: string | null;
  version: number;

  // DTO額外字段
  taskId?: number;
  categoryId?: number;
  createdAt?: string;
  updatedAt?: string;
  typeCategory?: TypeCategory;
};

export type Assignee = {
  id: number;
  name: string;
};

export type Coordinate = {
  x: number;
  y: number;
};

export type TimerInfo = {
  id: number;
  name: string;
  position: Coordinate;
  scrollOffset: Coordinate;
  milestone: Milestone;
  task: Task;
  startTime: string;
  project: Project;
};
