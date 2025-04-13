import { useContext } from "react";
import type { Priority, ProjectClientType, Status } from "@shared/utils/types";
import type { TypeCategoryLevel } from "@dto/typeCategory/index";
import { ProjectFormContext } from "@/projectManagement/contexts/projectContext";

// 自定義類別保存函數類型定義
interface SaveCustomCategoryFn {
  (name: string, categoryLevel?: TypeCategoryLevel): Promise<number>;
}

// 全局接口擴展
declare global {
  var useProjectFormSaveCustomCategory: SaveCustomCategoryFn | undefined;
}

/**
 * 使用專案表單Hook
 *
 * 提供專案表單的狀態和更新方法
 */
export function useProjectForm() {
  return useContext(ProjectFormContext);
}

// 提供保存自定義類別的靜態方法
useProjectForm.saveCustomCategory = async (
  name: string,
  categoryLevel: TypeCategoryLevel = "PROJECT",
): Promise<number> => {
  // 檢查是否有全局實現
  if (
    typeof window !== "undefined" &&
    window.useProjectFormSaveCustomCategory
  ) {
    return window.useProjectFormSaveCustomCategory(name, categoryLevel);
  }

  // 默認實現
  console.warn("saveCustomCategory 方法尚未實現");
  return Promise.resolve(0);
};

export const initialProject = {
  name: "",
  budgetedHours: 0,
  description: "",
  range: {
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    key: "selection",
  },
  clientType: "USER" as ProjectClientType,
  clientCompanyId: null as number | null,
  clientCompanyUserId: null as number | null,
  customClientName: null as string | null,
  categoryId: null as number | null,
  customCategory: "" as string,
  customCategoryDescription: "" as string,
  assignee: "",
  assigneeId: null as number | null,
  priority: "MEDIUM" as Priority,
  status: "PREPARATION" as Status,
};
