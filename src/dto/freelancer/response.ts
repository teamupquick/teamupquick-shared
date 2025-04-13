import type {
  AccountStatusType,
  FreelancerWorkingTypeEnum,
  ProjectDurationPreferenceType,
  WorkStylePreferenceType,
} from "./common";

/**
 * 自由工作者基本信息DTO
 */
export interface FreelancerDto {
  id: number;
  name: string;
  email: string;
  title: string;
  pictureUrl?: string;
  description?: string;
  experiences?: string;
  hourlyRate: number;
  location?: string;
  workingType: string;
  weeklyAvailableHours?: number;
  availableForWork: boolean;
  phoneNumber?: string;
  workingHours?: string;
  preferredProjectDuration?: ProjectDurationPreferenceType;
  preferredWorkStyle?: WorkStylePreferenceType;
  accountStatus: AccountStatusType;
}

/**
 * 技能DTO
 */
export interface SkillDto {
  name: string;
  proficiency: number;
  yearsOfExperience: number;
  isVerified?: boolean;
}

/**
 * 工作經驗DTO
 */
export interface WorkExperienceDto {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  skills?: string[];
  achievements?: string[];
}

/**
 * 項目工時統計DTO
 */
export interface ProjectHoursDto {
  category: string;
  totalHours: number;
}

/**
 * 自由工作者詳細資料DTO
 */
export interface FreelancerProfileDto extends FreelancerDto {
  skills: SkillDto[];
  socialLinks?: Record<string, string>;
  workExperience?: WorkExperienceDto[];
  portfolioWorks?: Record<string, any>;
  expertises: string[];
  yearsOfExperience: string;
  expectedHourlyRates: number;
  availableWeeklyHours: number;
  totalHours: number;
  totalProjects: number;
  totalMilestones: number;
  totalTasks: number;
  totalSubtasks: number;
  totalComments: number;
  totalFiles: number;
  totalLinks: number;
  totalMembers: number;
  joinedDate: string;
  userId: number;
  projectHours: ProjectHoursDto[];
}

/**
 * 自由工作者薪資統計DTO
 */
export interface FreelancerSalaryDto {
  date: string;
  max: number;
  min: number;
  median: number;
  totalHours: number;
}

/**
 * 搜索自由工作者結果DTO
 */
export interface SearchedFreelancerDto {
  id: number;
  name: string;
  title: string;
  pictureUrl: string;
  experiences: string;
  hourlyRate: number;
  location: string;
  weeklyAvailableHours: number;
  workingType: FreelancerWorkingTypeEnum;
  availableForWork: boolean;
  preferredProjectDuration?: ProjectDurationPreferenceType;
  preferredWorkStyle?: WorkStylePreferenceType;
  skills: SkillDto[];
  totalHours: number;
  totalProjects: number;
  totalTasks: number;
}
