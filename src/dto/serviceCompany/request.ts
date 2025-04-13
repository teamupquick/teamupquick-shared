import { PreferredWorkStyleType, PreferredProjectDurationType } from "./common";

/**
 * 搜索服務公司請求DTO
 */
export interface SearchServiceCompanyQueryDto {
  name?: string;
  experiences?: string;
  priceRate?: number;
  weeklyAvailableHours?: number;
  availableForWork?: boolean;
  skills?: string;
  location?: string;
  preferredWorkStyle?: PreferredWorkStyleType;
  preferredProjectDuration?: PreferredProjectDurationType;
}
