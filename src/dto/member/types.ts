import type { User } from "@shared/api/userService";
import type { MilestoneInvitationStatus } from "@dto/invitation/common";
import type { RoleTypeDto, InviteeType } from "@dto/roleType";

/**
 * 公司用戶介面
 */
export interface CompanyUser {
  id: number;
  name: string;
  email: string;
  companyId?: number;
  position?: string;
  department?: string;
  pictureUrl?: string;
  companyEmail?: string;
  source?: string;
  companyPhone?: string;
  companyAddress?: string;
  userId?: number;
}

/**
 * 里程碑成員類型
 * 描述里程碑團隊中的成員數據結構
 */
export interface MilestoneMember {
  /** ID */
  id?: number;

  /** 用戶基本信息 */
  user: Pick<User, "id" | "name" | "email">;

  /** 用戶ID */
  userId: number;

  /** 時薪 */
  hourlyRate: number;

  /** 角色類型ID */
  roleId: number; // 根據後端DTO更新為roleId

  /** 角色類型 */
  roleType: RoleTypeDto; // 根據後端DTO更新為roleType

  /** 邀請狀態 */
  status?: string;

  /** 自由工作者ID */
  freelancerId?: number | null;

  /** 自由工作者資料 */
  freelancer?: any;

  /** 公司ID */
  companyId?: number | null;

  /** 公司用戶ID */
  companyUserId?: number | null;

  /** 公司用戶資料 */
  companyUser?: Partial<CompanyUser>;

  /** 邀請類型 */
  type?: string;

  /** 邀請訊息或備註 */
  remark?: string;

  /** 權限等級 */
  permissionLevel?: "READ" | "WRITE" | "ADMIN";
}

/**
 * 新增里程碑成員參數類型
 * 用於處理新增團隊成員的請求
 */
export interface AddMilestoneMemberParams {
  /** 用戶ID */
  userId: number;

  /** 時薪 */
  hourlyRate: number;

  /** 角色類型ID */
  roleId: number; // 根據後端DTO更新為roleId

  /** 自由工作者ID (選填) */
  freelancerId?: number | null;

  /** 公司ID (選填) */
  companyId?: number | null;

  /** 公司用戶ID (選填) */
  companyUserId?: number | null;

  /** 備註 */
  remark?: string;

  /** 邀請訊息 */
  message?: string;
}

/**
 * 更新里程碑成員參數類型
 */
export interface UpdateMilestoneMemberParams {
  /** 時薪 */
  hourlyRate?: number;

  /** 角色ID */
  roleId?: number;

  /** 狀態 */
  status?: string;

  /** 備註 */
  remark?: string;
}
