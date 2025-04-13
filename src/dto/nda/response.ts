import type { NdaTemplateType } from "./common";

/**
 * NDA模板響應DTO
 */
export interface NdaTemplateDto {
  id: number;
  name: string;
  description: string;
  type: NdaTemplateType;
  companyId: number | null;
  isSystemTemplate: boolean;
  defaultExpirationDays: number;
  isActive: boolean;
}
