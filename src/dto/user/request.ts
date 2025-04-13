/**
 * 用戶搜索請求DTO
 */
export interface SearchUserQueryDto {
  name?: string;
  yearsOfExperience?: string;
  expertises?: string[];
  expectedHourlyRates?: string;
  availableWeeklyHours?: string;
  totalHours?: number;
}
