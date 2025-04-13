import type { CompanyUserDto } from "@dto/user";

export interface CompanyResponseDto {
  id: number;
  name: string;
  url: string;
  contactEmail: string;
  contactPersonName: string;
  contactPhoneNumber: string;
  responsibleUserId?: number;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyWithUsersResponseDto extends CompanyResponseDto {
  companyUsers: CompanyUserDto[];
}
