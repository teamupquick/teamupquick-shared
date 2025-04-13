import { useState, useCallback, useRef } from "react";
import type {
  TypeCategoryResponseDto,
  CreateTypeCategoryDto,
} from "@dto/typeCategory";
import { useTypeCategory } from "@shared/hooks/useTypeCategoryAction";

// 聲明全局追踪類別 ID 的變量
declare global {
  var lastCreatedCategoryIds: Record<string, number | null>;
}

// 初始化全局變量
if (!window.lastCreatedCategoryIds) {
  window.lastCreatedCategoryIds = {};
}

// 類別級別類型
export type CategoryLevel = "PROJECT" | "MILESTONE" | "TASK" | "SUBTASK";

// 返回的自定義類別工具類型
interface UseCustomCategoryResult {
  // 創建新的自定義類別
  createNewCategory: (
    name: string,
    description?: string,
    level?: CategoryLevel,
    parentId?: number | null,
    companyId?: number,
  ) => Promise<TypeCategoryResponseDto | null>;

  // 獲取上次創建的類別 ID
  getLastCreatedCategoryId: (level: CategoryLevel) => number | null;

  // 設置類別 ID
  setLastCreatedCategoryId: (level: CategoryLevel, id: number | null) => void;

  // 清除指定級別的類別 ID
  clearLastCreatedCategoryId: (level: CategoryLevel) => void;

  // 清除所有級別的類別 ID
  clearAllCategoryIds: () => void;

  // 是否正在創建類別
  isCreating: boolean;
}

/**
 * 自定義類別工具 hook
 * 用於創建和跟踪不同級別的自定義類別
 */
export function useCustomCategory(): UseCustomCategoryResult {
  const { createCategory } = useTypeCategory();
  const [isCreating, setIsCreating] = useState(false);

  // 創建新的自定義類別
  const createNewCategory = useCallback(
    async (
      name: string,
      description?: string,
      level: CategoryLevel = "PROJECT",
      parentId?: number | null,
      companyId?: number,
    ): Promise<TypeCategoryResponseDto | null> => {
      if (!name.trim()) {
        return null;
      }

      setIsCreating(true);
      try {
        const categoryData: CreateTypeCategoryDto = {
          name: name.trim(),
          description: description?.trim() || name.trim(),
          level: level,
          isSystem: false, // 非系統預設類別
          isActive: true, // 啟用狀態
          parentId: parentId || undefined, // 添加父類別ID
          companyId: companyId || undefined, // 添加公司ID
        };

        const newCategory = await createCategory(categoryData);

        if (newCategory) {
          window.lastCreatedCategoryIds[level] = newCategory.id;
          return newCategory;
        }

        return null;
      } catch (error) {
        console.error("[useCustomCategory] 創建過程中出錯:", error);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [createCategory],
  );

  // 獲取上次創建的類別 ID
  const getLastCreatedCategoryId = useCallback(
    (level: CategoryLevel): number | null => {
      return window.lastCreatedCategoryIds[level] || null;
    },
    [],
  );

  // 設置類別 ID (用於外部手動設置)
  const setLastCreatedCategoryId = useCallback(
    (level: CategoryLevel, id: number | null) => {
      window.lastCreatedCategoryIds[level] = id;
    },
    [],
  );

  // 清除指定級別的類別 ID
  const clearLastCreatedCategoryId = useCallback((level: CategoryLevel) => {
    window.lastCreatedCategoryIds[level] = null;
  }, []);

  // 清除所有級別的類別 ID
  const clearAllCategoryIds = useCallback(() => {
    window.lastCreatedCategoryIds = {};
  }, []);

  return {
    createNewCategory,
    getLastCreatedCategoryId,
    setLastCreatedCategoryId,
    clearLastCreatedCategoryId,
    clearAllCategoryIds,
    isCreating,
  };
}

/**
 * 創建自定義類別並返回其 ID
 * 此函數可在非 React 組件中使用
 */
export async function createCustomCategory(
  name: string,
  description?: string,
  level: CategoryLevel = "PROJECT",
  parentId?: number | null,
  companyId?: number,
): Promise<number | null> {
  // 如果在非 React 組件中使用，我們需要直接調用 API
  try {
    // 這裡直接導入 typeCategoryService 以避免在非 React 組件中使用 hook
    const { createCategory } = require("../../api/typeCategoryService");

    if (!name.trim()) {
      return null;
    }

    const categoryData: CreateTypeCategoryDto = {
      name: name.trim(),
      description: description?.trim() || name.trim(),
      level: level,
      isSystem: false,
      isActive: true,
      parentId: parentId || undefined, // 添加父類別ID
      companyId: companyId || undefined, // 添加公司ID
    };

    const newCategory = await createCategory(categoryData);

    if (newCategory) {
      // 更新全局變量儲存創建的 ID
      window.lastCreatedCategoryIds[level] = newCategory.id;

      return newCategory.id;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export default useCustomCategory;
