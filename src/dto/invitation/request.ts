import type { SearchedServiceCompanyDto } from "@dto/serviceCompany";
import type { ChangeEvent } from "react";
import type { MilestoneMemberRole } from "@shared/utils/types";
import type { MilestoneInvitationStatus } from "@dto/invitation/common";
/**
 * 拒絕邀請請求DTO
 */
export interface RejectInvitationRequestDto {
  publicId: string;
  reason: string;
  companyUserId?: number | null;
}

/**
 * 創建成員邀請DTO
 */
export interface CreateMemberInvitationDto {
  milestoneId: number;
  milestonePublicId?: string;
  userId: number;
  hourlyRate: number;
  roleId: number;
  inviteeType: string;
  freelancerId?: number;
  companyUserId?: number;
  companyId?: number;
  representingCompanyId?: number;
  remark?: string;
  invitedAt?: Date;
  ndaTemplateId?: number;
  status?: MilestoneInvitationStatus;
}

/**
 * 更新成員邀請DTO
 */
export interface UpdateMemberInvitationDto {
  status?: string;
  hourlyRate?: number;
  role?: MilestoneMemberRole;
  remark?: string;
}

/**
 * 隊長邀請表單組件屬性接口
 */
export interface LeaderInviteFormProps {
  leaderId: string | number;
  onClose: () => void;
  leaderName: string;
  processedProfile: any;
}

/**
 * 人才邀請表單組件屬性接口
 */
export interface TalentInviteFormProps {
  talentId: string | number;
  onClose: () => void;
  talentName: string;
  processedProfile: any;
}

/**
 * 隊長邀請表單數據接口
 */
export interface LeaderInviteFormData {
  leaderId: string | number;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderRate: number;
  ndaTemplateId: string;
  invitationMessage: string;
}

/**
 * 人才邀請表單數據接口
 */
export interface TalentInviteFormData {
  talentId: string | number;
  talentName: string;
  talentEmail: string;
  talentPhone: string;
  talentRate: number;
  ndaTemplateId: string;
  invitationMessage: string;
}

/**
 * 受邀人資訊組件屬性介面
 */
export interface RecipientInfoProps {
  leaderName: string;
  processedProfile: SearchedServiceCompanyDto;
  milestoneForm: any;
  handleRateChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
