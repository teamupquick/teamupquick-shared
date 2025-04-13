import type { Priority, Status } from "@shared/utils/types";
import type { MilestoneInvitationStatus } from "@dto/invitation/common";
import type { MilestoneMember } from "@dto/member/types";
import type { Range } from "@dto/common";

/**
 * 里程碑創建/更新請求DTO
 */
export type MilestoneRequest = {
  name: string;
  description: string;
  version: number;
  categoryId?: number;
  customCategory?: string;
  assigneeId: number;
  priority: Priority;
  status: Status;
  members: (Pick<MilestoneMember, "hourlyRate" | "roleType"> & {
    userId: number;
  })[];
  budgetedHours: number;
  startDate: string;
  endDate: string;
  leaderId: number | null;
  leaderRate: number;
  clientCompanyUserId?: number;
  publicId?: string;
  ndaTemplateId?: number | null;
  ndaContent?: string | null;
  invitationMessage?: string | null;
  projectPublicId?: string;
};

/**
 * 里程碑領導者表單類型
 */
export type MilestoneFormLeader = {
  leader?: {
    id: number;
    name: string;
    ndaTemplateId?: number | null;
    ndaContent?: string | null;
    invitationMessage?: string | null;
    leaderStatus: MilestoneInvitationStatus | undefined;
    leaderRate: number;
  };
  leaderId: number | null;
  leaderRate: number;
};

/**
 * 里程碑成員表單類型
 */
export type MilestoneFormMember = { status?: MilestoneInvitationStatus } & Omit<
  MilestoneMember,
  "status"
>;

/**
 * 簡化的成員表單類型（兼容InviteMemberForm使用）
 */
export type SimpleMilestoneFormMember = {
  user: {
    id: number;
    name: string;
    companyId?: number | null;
  };
  hourlyRate: number;
  role: string;
  status?: MilestoneInvitationStatus;
  message: string;
  roleType?: any;
  roleTypeId?: number;
};

// 表單對象類型定義
export interface MilestoneForm {
  id: number | null;
  name: string;
  description: string;
  priority: Priority | null;
  status: Status | null;
  category: string | number | null;
  categoryId: number | null;
  customCategory: string | null;
  customCategoryDescription?: string | null;
  budgetedHours: number | string;
  assigneeId: string;
  leaderId: string | null;
  leaderRate: number;
  clientCompanyUserId: number | null;
  projectCategoryId?: number | null; // 確保在接口中添加此字段
  members: {
    userId: number;
    hourlyRate: number;
    role: string;
  }[];
  startDate: Date | null;
  endDate: Date | null;
  version?: string;
  range?: Range;
}
