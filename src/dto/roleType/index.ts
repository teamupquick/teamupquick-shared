/**
 * 角色類型 DTO
 * 定義系統中不同角色類型的數據結構
 */
export interface RoleTypeDto {
  /** 角色類型ID */
  id: number;

  /** 角色名稱 */
  name: string;

  /** 角色代碼 */
  code: string;

  /** 角色描述 */
  description: string;

  /** 是否為自定義角色 */
  isCustom?: boolean;

  /** 是否為活躍角色 */
  isActive: boolean;

  /** 創建時間 */
  createdAt?: string;

  /** 更新時間 */
  updatedAt?: string;
}

/**
 * 邀請類型枚舉
 * 定義邀請成員的不同類型
 */
export enum InviteeType {
  /** 自由工作者 */
  FREELANCER = "FREELANCER",

  /** 客戶 */
  CLIENT = "CLIENT",

  /** 服務公司 */
  SERVICECOMPANY = "SERVICECOMPANY",
}

/**
 * 創建簡單的角色類型物件
 */
export function createRoleTypeDto(
  id: number,
  name: string,
  code: string,
): RoleTypeDto {
  return {
    id,
    name,
    code,
    description: "",
    isActive: true,
    createdAt: "",
    updatedAt: "",
  };
}
