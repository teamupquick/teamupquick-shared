import type { InviteeType } from "@dto/roleType";
import type {
  InvitationMilestoneDto,
  MilestoneInvitationStatus,
} from "./common";
import type { MilestoneMemberRole, RoleType } from "@shared/utils/types";

/**
 * 隊長邀請詳情DTO
 */
export interface LeaderInvitationDetailDto {
  id: number;
  publicId: string;
  leaderRate: number;
  milestone: InvitationMilestoneDto | null;
  status: MilestoneInvitationStatus;
  message?: string;
}

/**
 * 成員邀請詳情DTO
 */
export interface MemberInvitationDetailDto {
  id: number;
  publicId: string;
  role: MilestoneMemberRole;
  hourlyRate: number;
  milestone: InvitationMilestoneDto | null;
  status: MilestoneInvitationStatus;
  companyUserId?: number | null;
  companyUser?: {
    id: number;
    name: string;
    companyId: number;
    companyName?: string;
  } | null;
}

/**
 * 邀請操作響應DTO
 */
export interface InvitationOperationResponseDto {
  success: boolean;
  invitationDetail: LeaderInvitationDetailDto | MemberInvitationDetailDto;
}

/**
 * 邀請內容組件屬性介面
 */
export interface InvitationContentProps {
  invitationMessage: string;
  setInvitationMessage: (message: string) => void;
  handleClearMessage: () => void;
}
export interface MilestoneLeaderInvitation {
  __brand: "milestoneLeaderInvitations";
  id: number;
  publicId: string;
  leader: {
    id: number;
    name: string;
    priceRate: number;
    company: {
      id: number;
      name: string;
      responsibleUser: {
        id: number;
        name: string;
      };
    };
  };
  status: MilestoneInvitationStatus;
  leaderRate: number;
  acceptedAt: string | null;
  expiredAt: string | null;
  invitedAt: string;
  removedAt: string | null;
  message?: string;
  milestone?: InvitationMilestoneDto | null;
}

/**
 * 里程碑成員邀請類型
 * 與 MilestoneLeaderInvitation 結構類似，但包含成員特有的字段
 */
export interface MilestoneMemberInvitation {
  id: number;
  publicId: string;
  status: MilestoneInvitationStatus;
  hourlyRate: number;
  role: MilestoneMemberRole;
  roleId: number;
  roleType?: {
    id: number;
    name: string;
    code?: string;
    description?: string;
  };
  user: {
    id: number;
    name: string;
    email?: string;
  };
  acceptedAt: string | null;
  expiredAt: string | null;
  invitedAt: string;
  removedAt: string | null;
  remark: string;
  inviteeType: InviteeType;
  milestone: InvitationMilestoneDto | null;
  company: {
    id: number;
    name: string;
  } | null;
  companyUser: {
    id: number;
    name: string;
    companyId: number;
    companyName?: string;
  } | null;
  freelancer: {
    id: number;
    name: string;
    email?: string;
  } | null;
}

export type InvitationStep = "info" | "accepted" | "rejected" | "failed";

export type InvitationFormData = {
  id: number;
  projectName: string;
  milestoneName: string;
  memberRole?: RoleType;
  rate: number;
  status: MilestoneInvitationStatus;
  message?: string | null;
  publicId: string;
};
