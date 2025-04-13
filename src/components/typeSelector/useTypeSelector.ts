import { useState, useEffect, useRef, useCallback } from "react";
import { useTypeCategory } from "@shared/hooks/useTypeCategoryAction";
import useCustomCategory from "./useCustomCategory";
import type { CategoryOption, TypeSelectorState, CategoryLevel } from "./types";
import type { TypeCategoryResponseDto } from "@dto/typeCategory";
// 直接靜態導入服務
import TypeCategoryService from "@shared/api/typeCategoryService";

interface UseTypeSelectorProps {
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
  disableAutoCreate?: boolean;
  showCompanyIndicator?: boolean;
}

export function useTypeSelector({
  level,
  categoryId,
  customValue = "",
  onChange,
  parentId,
  companyId,
  disableAutoCreate = false,
  showCompanyIndicator = false,
}: UseTypeSelectorProps) {
  const [state, setState] = useState<TypeSelectorState>({
    categories: [],
    allCategories: [],
    isCustomSelected: false,
    isLoading: true,
    inputValue: "",
    descriptionValue: "",
  });

  const isMountedRef = useRef(true);
  const customCategoryHook = useCustomCategory();
  const {
    loading,
    getProjectCategories,
    getMilestoneCategories,
    getTaskCategories,
    getSubTaskCategories,
  } = useTypeCategory();

  // 過濾類別列表
  const filterCategories = useCallback(
    (allCategories: TypeCategoryResponseDto[]) => {
      // 如果沒有過濾條件，直接返回原列表

      if (!companyId && !parentId) {
        return allCategories;
      }
      const filteredResult = allCategories.filter((category) => {
        // 如果提供了公司 ID，則只顯示該公司的類別或系統類別
        const companyMatch =
          !companyId ||
          !category.companyId ||
          category.companyId === companyId ||
          !category.companyId ||
          category.isSystem;
        // 如果提供了父類別 ID，則只顯示該父類別的子類別
        const parentMatch =
          !parentId || !category.parentId || category.parentId === parentId;
        const existItem = categoryId === category.id;
        return existItem || (companyMatch && parentMatch);
      });
      return filteredResult;
    },
    [companyId, parentId, categoryId],
  );

  // 初始化組件
  useEffect(() => {
    isMountedRef.current = true;

    const fetchData = async () => {
      try {
        let result;

        if (level === "PROJECT") {
          result = await TypeCategoryService.getTypeCategories({
            level: "PROJECT",
            onlyActive: true,
          });
        } else if (level === "MILESTONE") {
          result = await TypeCategoryService.getTypeCategories({
            level: "MILESTONE",
            onlyActive: true,
          });
        } else if (level === "TASK") {
          result = await TypeCategoryService.getTypeCategories({
            level: "TASK",
            onlyActive: true,
          });
        } else if (level === "SUBTASK") {
          result = await TypeCategoryService.getTypeCategories({
            level: "SUBTASK",
            onlyActive: true,
          });
        }

        if (
          result &&
          Array.isArray(result) &&
          result.length > 0 &&
          isMountedRef.current
        ) {
          // 保存所有類別並過濾顯示列表
          setState((prev) => ({
            ...prev,
            allCategories: result,

            isLoading: false,
          }));
        } else {
          // 如果直接請求沒有數據，嘗試使用 hook 方法
          handleLoadCategories();
        }
      } catch (error) {
        // 失敗後嘗試標準方法
        handleLoadCategories();
      }
    };

    fetchData();
    return () => {
      isMountedRef.current = false;
    };
  }, [level, categoryId]);

  // 加載類別數據
  const handleLoadCategories = async () => {
    try {
      let result: TypeCategoryResponseDto[] = [];

      if (level === "PROJECT") {
        result = await getProjectCategories();
      } else if (level === "MILESTONE") {
        result = await getMilestoneCategories();
      } else if (level === "TASK") {
        result = await getTaskCategories();
      } else if (level === "SUBTASK") {
        result = await getSubTaskCategories();
      }

      if (isMountedRef.current) {
        // 保存所有類別並過濾顯示列表
        const filteredCategories = filterCategories(result);
        setState((prev) => ({
          ...prev,
          allCategories: result,
          categories: filteredCategories,
          isLoading: false,
        }));
      }

      return result;
    } catch (error) {
      console.error(`[TypeSelector] 加載 ${level} 類別失敗:`, error);
      if (isMountedRef.current) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
      return [];
    }
  };

  // 更新選擇的類別
  useEffect(() => {
    handleInitialValue();
    checkLastCreatedCategory();
  }, [categoryId]);

  // 處理初始值
  const handleInitialValue = () => {
    if (customValue) {
      setState((prev) => ({
        ...prev,
        isCustomSelected: true,
        inputValue: customValue,
      }));
    } else if (categoryId) {
      const selectedCategory = state.categories.find(
        (cat) => cat.id === categoryId,
      );

      if (selectedCategory) {
        setState((prev) => ({
          ...prev,
          isCustomSelected: false,
          inputValue: selectedCategory.name,
        }));
      } else if (state.categories.length === 0) {
        handleLoadCategories().then(() => {
          // 重新加載後再次嘗試查找類別
          const reloadedCategory = state.categories.find(
            (cat) => cat.id === categoryId,
          );
          if (reloadedCategory && isMountedRef.current) {
            setState((prev) => ({
              ...prev,
              isCustomSelected: false,
              inputValue: reloadedCategory.name,
            }));
          }
        });
      }
    } else {
      setState((prev) => ({
        ...prev,
        isCustomSelected: false,
        inputValue: "",
      }));
    }
  };

  // 檢測最近創建的類別
  const checkLastCreatedCategory = () => {
    if (disableAutoCreate || !customCategoryHook || !state.categories.length)
      return;

    const lastCreatedId = customCategoryHook.getLastCreatedCategoryId(level);

    if (lastCreatedId && lastCreatedId > 0) {
      const category = state.categories.find((cat) => cat.id === lastCreatedId);
      if (category) {
        setState((prev) => ({
          ...prev,
          isCustomSelected: false,
          inputValue: category.name,
        }));
        onChange(lastCreatedId, "", "");
        customCategoryHook.clearLastCreatedCategoryId(level);
      }
    }
  };

  // 處理選項選擇
  const handleChangeOption = (
    _: React.SyntheticEvent,
    option: CategoryOption | string | null,
  ) => {
    if (option === null) {
      // 按下 X 按鈕時，效果與選擇"其他 (自定義)"選項相同
      setState((prev) => ({
        ...prev,
        isCustomSelected: true,
        inputValue: "",
      }));
      onChange(null, "", state.descriptionValue);
      return;
    }

    if (typeof option === "string") {
      if (!option.trim()) {
        setState((prev) => ({
          ...prev,
          isCustomSelected: true,
          inputValue: "",
        }));
        onChange(null, "", state.descriptionValue);
      } else {
        setState((prev) => ({
          ...prev,
          isCustomSelected: true,
          inputValue: option,
        }));
        onChange(null, option, state.descriptionValue);
      }
      return;
    }

    // 處理選擇現有類別的情況
    if ("value" in option) {
      if (option.value === "OTHER") {
        // 選擇"其他"選項
        setState((prev) => ({
          ...prev,
          isCustomSelected: true,
          inputValue: "",
        }));
        onChange(null, "", state.descriptionValue);
      } else {
        // 檢查選項是否在 categories 中，如果不在則添加
        addToCategoriesIfNeeded(option);

        // 選擇現有類別
        const categoryId = parseInt(option.value, 10);
        setState((prev) => ({
          ...prev,
          isCustomSelected: false,
          inputValue: option.label,
        }));
        // 確保立即更新選擇的類型
        onChange(categoryId, "", state.descriptionValue);
      }
    }
  };

  // 如果選項在 allCategories 但不在 categories 中，則將其添加到 categories
  const addToCategoriesIfNeeded = (option: CategoryOption) => {
    if (!option.userData) return;

    // 檢查選項是否已在 categories 中
    const exists = state.categories.some(
      (cat) => cat.id.toString() === option.value,
    );

    if (!exists) {
      // 找到在 allCategories 中對應的類別
      const categoryFromAll = state.allCategories.find(
        (cat) => cat.id.toString() === option.value,
      );

      if (categoryFromAll) {
        // 添加到 categories
        setState((prev) => ({
          ...prev,
          categories: [...prev.categories, categoryFromAll],
        }));
      }
    }
  };

  // 處理輸入變更
  const handleInputChange = (
    _: React.SyntheticEvent,
    newInputValue: string,
  ) => {
    setState((prev) => ({
      ...prev,
      inputValue: newInputValue,
    }));

    if (state.isCustomSelected) {
      if (!newInputValue.trim()) {
        // 輸入清空時，保持自定義模式，只清空輸入值
        setState((prev) => ({
          ...prev,
          isCustomSelected: true,
          inputValue: "",
        }));
        onChange(null, "", state.descriptionValue);
        return;
      }
      onChange(null, newInputValue, state.descriptionValue);
    }
  };

  // 處理描述輸入變更
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const newValue = e.target.value;
    setState((prev) => ({
      ...prev,
      descriptionValue: newValue,
    }));

    if (state.isCustomSelected) {
      onChange(null, state.inputValue, newValue);
    }
  };

  // 按鍵處理
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && state.inputValue && !state.isCustomSelected) {
      setState((prev) => ({
        ...prev,
        isCustomSelected: true,
      }));
      onChange(null, state.inputValue, state.descriptionValue);
    }
  };

  // 獲取當前選擇值
  const getCurrentValue = (): CategoryOption | null => {
    if (state.isCustomSelected) {
      return {
        label: customValue || state.inputValue,
        value: "OTHER",
      };
    }

    if (categoryId) {
      const selectedCategory = state.categories.find(
        (cat) => cat.id === categoryId,
      );
      if (selectedCategory) {
        return {
          label: selectedCategory.name,
          value: selectedCategory.id.toString(),
        };
      } else {
        return {
          label: `類型 #${categoryId}`,
          value: categoryId.toString(),
        };
      }
    }

    return null;
  };

  // 檢測是否是新創建的類別
  const isNewCategory = useCallback(() => {
    return (
      state.isCustomSelected &&
      state.inputValue.trim().length > 0 &&
      !state.categories.some(
        (category) =>
          category.name.toLowerCase() === state.inputValue.toLowerCase(),
      )
    );
  }, [state.isCustomSelected, state.inputValue, state.categories]);

  // 選項轉換函數
  const mapCategoriesToOptions = useCallback(
    (categories: TypeCategoryResponseDto[]): CategoryOption[] => {
      // 移除重複的類別名稱，防止鍵值重複錯誤
      const uniqueCategories = categories.reduce(
        (acc: TypeCategoryResponseDto[], current) => {
          // 檢查當前類別名稱是否已存在
          const exists = acc.find((item) => item.name === current.name);
          if (!exists) {
            acc.push(current);
          } else {
            // 如果名稱重複，為其附加 ID 使其唯一
            const modifiedCategory = {
              ...current,
              name: `${current.name} (ID: ${current.id})`,
            };
            acc.push(modifiedCategory);
          }
          return acc;
        },
        [],
      );

      const options = uniqueCategories
        .filter((category) => category.isActive !== false)
        .map((category) => {
          return {
            value: category.id.toString(),
            label: category.name,
            description: category.description || "",
            userData: category,
            parentId: category.parentId,
            companyId: category.companyId,
          };
        });

      // 添加"其他"選項
      const otherOption: CategoryOption = {
        value: "OTHER",
        label: "其他 (自定義)",
        description: "",
        userData: {
          id: -1,
          name: "其他",
          description: "",
          appliesTo: [],
          level: level,
          isSystem: true,
          isActive: true,
          sortOrder: 999,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      return [...options, otherOption];
    },
    [level],
  );

  // 取得選項列表
  const getEnhancedOptions = useCallback(() => {
    return mapCategoriesToOptions(state.categories);
  }, [state.categories, mapCategoriesToOptions]);

  // 取得所有類別選項（包括未過濾的）用於搜尋
  const getAllCategoryOptions = useCallback(() => {
    return mapCategoriesToOptions(state.allCategories);
  }, [state.allCategories, mapCategoriesToOptions]);

  // 創建和選擇自定義類別
  const handleCreateAndSelect = async () => {
    if (!state.isCustomSelected || state.inputValue.trim().length === 0) {
      return;
    }

    try {
      const newCategoryData = {
        name: state.inputValue.trim(),
        description: state.descriptionValue.trim(),
        level: level,
        isActive: true,
      };

      // 創建類別

      const result = await customCategoryHook.createNewCategory(
        newCategoryData.name,
        newCategoryData.description,
        level,
        parentId,
        companyId,
      );

      if (result && isMountedRef.current) {
        // 創建類別時設置公司ID (如果有)
        if (companyId && !result.companyId) {
          result.companyId = companyId;
        }

        // 創建類別時設置父類別ID (如果有)
        if (parentId && !result.parentId) {
          result.parentId = parentId;
        }

        // 更新類別列表 (同時更新原始列表和過濾後的列表)
        setState((prev) => ({
          ...prev,
          allCategories: [...prev.allCategories, result],
          categories: [...prev.categories, result],
          isCustomSelected: false,
        }));
        onChange(result.id, "", result.description || "");
      }
    } catch (error) {
      console.error("[TypeSelector] 創建自定義類別失敗:", error);
    }
  };

  return {
    state,
    loading: loading || customCategoryHook.isCreating,
    handleChangeOption,
    handleInputChange,
    handleDescriptionChange,
    handleKeyDown,
    getCurrentValue,
    getEnhancedOptions,
    getAllCategoryOptions,
    isNewCategory,
    handleCreateAndSelect,
    refreshCategories: handleLoadCategories,
  };
}
