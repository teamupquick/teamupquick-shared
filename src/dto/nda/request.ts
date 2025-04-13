import type { NdaTemplateType } from "./common";

/**
 * 創建NDA模板請求DTO
 */
export interface CreateNdaTemplateRequestDto {
  name: string;
  description: string;
  type: NdaTemplateType;
  content: string;
  defaultExpirationDays?: number;
}

/**
 * 更新NDA模板請求DTO
 */
export interface UpdateNdaTemplateRequestDto {
  name?: string;
  description?: string;
  type?: NdaTemplateType;
  content?: string;
  defaultExpirationDays?: number;
  isActive?: boolean;
}
