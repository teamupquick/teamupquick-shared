import type { TypeCategoryResponseDto } from "@dto/typeCategory";
import type { ChangeEvent } from "react";

// 類別級別類型
export type CategoryLevel = "PROJECT" | "MILESTONE" | "TASK" | "SUBTASK";

// TypeSelector 組件的 Props
export interface TypeSelectorProps {
  level: CategoryLevel;
  categoryId: number | null;
  customValue?: string;
  onChange: (
    categoryId: number | null,
    customValue?: string,
    description?: string,
  ) => void;
  parentId?: number;
  companyId?: number;
  label?: string;
  placeholder?: string;
  errorMsg?: string;
  disabled?: boolean;
  disableAutoCreate?: boolean;
  showCompanyIndicator?: boolean;
}

// 選項類型
export interface CategoryOption {
  label: string;
  value: string;
  description?: string;
  userData?: TypeCategoryResponseDto;
  parentId?: number;
  companyId?: number;
  isFromDifferentCompany?: boolean;
}

// TypeSelector 狀態類型
export interface TypeSelectorState {
  categories: TypeCategoryResponseDto[];
  allCategories: TypeCategoryResponseDto[];
  isCustomSelected: boolean;
  isLoading: boolean;
  inputValue: string;
  descriptionValue: string;
}
