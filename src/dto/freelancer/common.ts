/**
 * 自由工作者工作類型枚舉
 */
export enum FreelancerWorkingTypeEnum {
  UNSET = "UNSET",
  FULLTIME = "FULLTIME",
  PARTTIME = "PARTTIME",
  BOTH = "BOTH",
}

/**
 * 項目時長偏好類型
 */
export type ProjectDurationPreferenceType = "SHORT" | "MEDIUM" | "LONG" | "ANY";

/**
 * 工作風格偏好類型
 */
export type WorkStylePreferenceType = "REMOTE" | "ONSITE" | "HYBRID";

/**
 * 帳戶狀態類型
 */
export type AccountStatusType = "ACTIVE" | "SUSPENDED" | "PENDING";


/**
 * 里程碑成員角色類型
 */
export type MilestoneMemberRole =
  | "EE"
  | "LAYOUT"
  | "FW"
  | "SW"
  | "ME"
  | "OD"
  | "AC"
  | "PM"
  | "CSM"
  | "SUPPLIER"
  | "HR"
  | "SALES"
  | "SC";
