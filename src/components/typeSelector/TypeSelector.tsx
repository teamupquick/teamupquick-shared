import React, { useMemo, useEffect, useCallback } from "react";
import { TypeSelectorUI } from "./TypeSelectorUI";
import { useTypeSelector } from "./useTypeSelector";
import type { TypeSelectorProps, CategoryOption } from "./types";

/**
 * TypeSelector 組件 - 類型選擇器
 *
 * 用於選擇或創建專案、里程碑、任務或子任務的類型
 * 支持選擇現有類型或創建自定義類型
 */
export default function TypeSelector({
  level,
  categoryId,
  customValue = "",
  onChange,
  parentId,
  companyId,
  label = "類型",
  placeholder = "請選擇或輸入類型",
  errorMsg,
  disabled = false,
  disableAutoCreate = false,
  showCompanyIndicator = false,
}: TypeSelectorProps) {
  // 檢查輸入參數
  useEffect(() => {
    if (!level) {
      console.error("[TypeSelector] 錯誤: level 屬性未提供");
    }
  }, [level]);

  // 使用 TypeSelector hook 取得所有功能
  const {
    state,
    loading,
    handleChangeOption,
    handleInputChange,
    handleDescriptionChange,
    handleKeyDown,
    getCurrentValue,
    getEnhancedOptions,
    getAllCategoryOptions,
    isNewCategory,
    handleCreateAndSelect,
  } = useTypeSelector({
    level,
    categoryId,
    customValue,
    onChange,
    parentId,
    companyId,
    disableAutoCreate,
    showCompanyIndicator,
  });

  // 計算是否顯示添加按鈕
  const showAddButton = useMemo(() => {
    return state.isCustomSelected && state.inputValue.trim().length > 0;
  }, [state.isCustomSelected, state.inputValue]);

  // 過濾搜尋結果，只保留在 categories 中存在的選項
  const filterSearchResults = useCallback(
    (searchOptions: CategoryOption[]): CategoryOption[] => {
      // 取得當前過濾後的類別ID集合
      const filteredCategoryIds = new Set(
        state.categories.map((category) => category.id.toString()),
      );

      // 特殊處理某些選項
      const shouldKeepAll = false; // 設置為 true 可暫時禁用過濾以進行測試

      if (shouldKeepAll) {
        return searchOptions;
      }

      // 過濾搜尋結果，只保留在過濾後的類別中的選項或 "OTHER" 選項
      const filteredResults = searchOptions.filter((option) => {
        const keep =
          option.value === "OTHER" || filteredCategoryIds.has(option.value);
        return keep;
      });

      return filteredResults;
    },
    [state.categories],
  );

  // 組合所有屬性，傳遞給 UI 組件
  return (
    <TypeSelectorUI
      label={label}
      placeholder={placeholder}
      errorMsg={errorMsg}
      disabled={disabled}
      isLoading={state.isLoading}
      inputValue={state.inputValue}
      descriptionValue={state.descriptionValue}
      isCustomSelected={state.isCustomSelected}
      showAddButton={showAddButton}
      isCreating={loading}
      isNewCategory={isNewCategory}
      currentValue={getCurrentValue()}
      options={getEnhancedOptions()}
      searchOptions={getAllCategoryOptions()}
      filterSearchResults={filterSearchResults}
      onChangeOption={handleChangeOption}
      onInputChange={handleInputChange}
      onDescriptionChange={handleDescriptionChange}
      onKeyDown={handleKeyDown}
      onCreateAndSelect={handleCreateAndSelect}
    />
  );
}
