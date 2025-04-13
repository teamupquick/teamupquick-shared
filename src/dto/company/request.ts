export interface CreateCompanyDto {
  name: string;
  url?: string;
  contactEmail?: string;
  contactPersonName?: string;
  contactPhoneNumber?: string;
  responsibleUserId?: number;
}

export interface UpdateCompanyDto {
  name?: string;
  url?: string;
  contactEmail?: string;
  contactPersonName?: string;
  contactPhoneNumber?: string;
  responsibleUserId?: number;
  isDeleted?: boolean;
}
