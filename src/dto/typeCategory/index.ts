/**
 * 類別基本信息
 */

// TypeCategory 相關類型定義
export type TypeCategoryLevel = "PROJECT" | "MILESTONE" | "TASK" | "SUBTASK";

export interface TypeCategory {
  id: number;
  name: string;
  description: string;
  appliesTo: string[];
  level: "PROJECT" | "MILESTONE" | "TASK" | "SUBTASK";
  parentId?: number;
  companyId?: number;
  sortOrder: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children?: TypeCategory[];
}

/**
 * 類別響應DTO
 */
export interface TypeCategoryResponseDto {
  id: number;
  name: string;
  description: string;
  appliesTo: string[];
  level?: string;
  parentId?: number;
  companyId?: number;
  sortOrder: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 帶子類別的類別響應DTO
 */
export interface TypeCategoryWithChildrenResponseDto
  extends TypeCategoryResponseDto {
  children: TypeCategoryResponseDto[];
}

/**
 * 類別創建請求DTO
 */
export interface CreateTypeCategoryDto {
  name: string;
  description: string;
  level: "PROJECT" | "MILESTONE" | "TASK" | "SUBTASK";
  parentId?: number;
  companyId?: number;
  isSystem?: boolean;
  isActive?: boolean;
}

/**
 * 類別查詢參數
 */
export interface TypeCategoryQueryParams {
  level?: string;
  appliesTo?: string;
  parentId?: number;
  includeChildren?: boolean;
  onlyActive?: boolean;
}
