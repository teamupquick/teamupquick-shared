import type { ProjectForm } from "@dto/project/request";

export type MilestoneInvitationStatus =
  | "PENDING_INVITATION"
  | "INVITATION_ACCEPTED"
  | "INVITATION_REJECTED"
  | "INVITATION_EXPIRED"
  | "REMOVED"
  | "INVITATION_CANCELED"
  | "INVITATION_APPROVED";
/**
 * 專案信息DTO
 */
export interface InvitationProjectDto {
  id: number;
  name: string;
}

/**
 * 里程碑信息DTO
 */
export interface InvitationMilestoneDto {
  id: number;
  name: string;
  project: InvitationProjectDto;
}

/**
 * 隊長邀請表單數據介面
 */
export interface LeaderInviteFormData {
  leaderId: number;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderRate: number;
  ndaTemplateId: number | null;
  invitationMessage: string;
}

/**
 * 專案資訊組件屬性介面
 */
export interface ProjectInfoProps {
  project: ProjectForm | null;
}

/**
 * 拒絕邀請請求
 */
export interface RejectRequest {
  publicId: string;
  reason: string;
}
