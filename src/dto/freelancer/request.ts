import { FreelancerWorkingTypeEnum } from "./common";

/**
 * 搜索自由工作者請求DTO
 */
export interface SearchFreelancerQueryDto {
  searchTerm?: string;
  workingType?: FreelancerWorkingTypeEnum;
  weeklyAvailableHours?: number;
  location?: string;
  availableForWork?: string;
}
