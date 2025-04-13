import type { PreferredWorkStyleType, PreferredProjectDurationType } from "./common";
import type { CompanyUserDto } from "@dto/user";
/**
 * 技能DTO
 */
export interface CompanySkillDto {
  id: number;
  name: string;
  description: string | null;
}

/**
 * 服務公司技能DTO
 */
export interface ServiceCompanySkillDto {
  id: number;
  proficiency: number;
  yearsOfExperience: string;
  isVerified: boolean;
  projectCount: number;
  skill: CompanySkillDto;
}



/**
 * 搜索服務公司結果DTO
 */
export interface SearchedServiceCompanyDto {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: string;
  pictureUrl: string | null;
  experiences: string;
  priceRate: number;
  location: string;
  weeklyAvailableHours: number;
  availableForWork: boolean;
  workingHoursDescription: string;
  preferredWorkStyle: PreferredWorkStyleType;
  preferredProjectDuration: PreferredProjectDurationType;
  accountStatus: string;
  portfolioWorks: any | null;
  socialLinks: any | null;
  workExperience: any | null;
  totalHours: number;
  totalProjects: number;
  totalTasks: number;
  projectHours: Array<any>;
  joinDate: string;
  company: {
    id: number;
    name: string;
    contactPersonName: string;
    companyUsers: CompanyUserDto[];
  };
  skills: ServiceCompanySkillDto[];
}
