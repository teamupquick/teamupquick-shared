import { toast } from "react-toastify";
import type { TypeCategoryLevel } from "@dto/typeCategory/index";
import type { TypeCategoryResponseDto } from "@dto/typeCategory";

/**
 * 手動創建自定義類別函數
 * 供表單提交時使用，檢查是否需要創建自定義類別，並返回創建的類別ID
 */
export async function createCustomCategory({
  customCategoryName,
  level,
  description,
  createCategoryFn,
  onCreatingChange,
}: {
  customCategoryName?: string;
  level: TypeCategoryLevel;
  description?: string;
  createCategoryFn: (
    name: string,
    desc: string,
    level: TypeCategoryLevel,
  ) => Promise<TypeCategoryResponseDto | null>;
  onCreatingChange?: (creating: boolean) => void;
}): Promise<number | null> {
  // 如果沒有自定義類別名稱，返回 null
  if (!customCategoryName) {
    return null;
  }

  // 設置創建狀態
  if (onCreatingChange) onCreatingChange(true);

  try {
    // 使用提供的函數創建自定義類別
    const newCategory = await createCategoryFn(
      customCategoryName,
      description || customCategoryName, // 如果沒有提供描述，使用名稱作為描述
      level,
    );

    if (newCategory && newCategory.id) {
      return newCategory.id;
    } else {
      toast.error("自定義類別創建失敗，無法提交表單");
      return null;
    }
  } catch (error) {
    console.error(`創建${level}類別時出錯:`, error);
    toast.error("創建類別時發生錯誤，無法提交表單");
    return null;
  } finally {
    if (onCreatingChange) onCreatingChange(false);
  }
}

/**
 * 表單提交前檢查類別函數
 * 檢查表單數據中是否需要創建自定義類別，並處理創建流程
 */
export async function prepareCategoryBeforeSubmit({
  categoryId,
  customCategoryName,
  level,
  description,
  createCategoryFn,
  onCreatingChange,
}: {
  categoryId?: number | null;
  customCategoryName?: string;
  level: TypeCategoryLevel;
  description?: string;
  createCategoryFn: (
    name: string,
    desc: string,
    level: TypeCategoryLevel,
  ) => Promise<TypeCategoryResponseDto | null>;
  onCreatingChange?: (creating: boolean) => void;
}): Promise<number | null> {
  // 如果已經有有效的類別 ID，直接返回
  if (categoryId && categoryId > 0) {
    return categoryId;
  }

  // 如果沒有類別 ID 但有自定義類別名稱，創建新類別
  if (customCategoryName) {
    return createCustomCategory({
      customCategoryName,
      level,
      description,
      createCategoryFn,
      onCreatingChange,
    });
  }

  return null;
}
