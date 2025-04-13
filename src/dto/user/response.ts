/**
 * 項目工時統計
 */
export interface ProjectHourDto {
  category: string;
  totalHours: number;
}

/**
 * 用戶基本信息DTO
 */
export interface UserDto {
  id: number;
  name: string;
  email: string;
}

/**
 * 公司用戶DTO
 */
export interface CompanyUserDto {
  companyAddress: string;
  joinDate: string;
  employmentType: string;
  permissions: string[];
  responsibilities: string;
  isPlatformVerified: boolean;
  status: string;
  pictureUrl: string | null;
  isDeleted: boolean;
  id: number;
  userId: number;
  companyId: number;
  name: string;
  position: string;
  department: string;
  companyEmail: string;
  companyPhone: string;
  isAdmin: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

/**
 * 用戶個人資料DTO
 */
export interface UserProfileDto {
  id: number;
  name: string;
  email: string;
  totalHours: number;
  totalProjects: number;
  totalMilestones: number;
  totalTasks: number;
  totalSubTasks: number;
  joinedDate: string;
  yearsOfExperience: string;
  expertises: string[];
  expectedHourlyRates: string[];
  availableWeeklyHours: string;
  projectHours: ProjectHourDto[];
}

/**
 * 用戶薪資統計DTO
 */
export interface UserSalaryDto {
  date: string;
  max: number;
  min: number;
  median: number;
  totalHours: number;
}

/**
 * 搜索用戶結果DTO
 */
export interface SearchedUserDto {
  id: number;
  name: string;
  email: string;
  joinedDate: string;
  totalHours: number;
  totalProjects: number;
  totalTasks: number;
  yearsOfExperience: string;
  expertises: string[];
  expectedHourlyRates: string[];
  availableWeeklyHours: string;
  projectHours: ProjectHourDto[];
}

/**
 * 擴展的公司用戶DTO，兼容UserInfoSection使用
 */
export interface ExtendedCompanyUserDto extends Partial<CompanyUserDto> {
  id: number;
  name: string;
  pictureUrl?: string;
  companyEmail?: string;
  department?: string;
  position?: string;
  source?: string;
  email?: string;
}
