import { useEffect } from "react";
import { Box } from "@mui/material";
import type { RoleTypeSelectorProps } from "./types";
import { useRoleTypeData } from "./hooks/useRoleTypeData";
import { useRoleTypeInput } from "./hooks/useRoleTypeInput";
import { useRoleTypeOptions } from "./hooks/useRoleTypeOptions";
import { CustomRoleInputForm } from "./components/CustomRoleInputForm";
import { RoleTypeInput } from "./components/RoleTypeInput";
import { SelectorLabel, LoadingIndicator } from "./components/UIComponents";
import { useRoleType } from "@shared/hooks/useRoleTypeAction";

// 重新導出RoleLevel類型，保持向後兼容
export type { RoleLevel } from "./types";

/**
 * 角色類型選擇器
 * 允許使用者選擇現有角色類型或創建自定義角色類型
 */
export default function RoleTypeSelector({
  roleTypeId,
  customValue = "",
  onChange,
  label = "角色類型",
  placeholder = "請選擇或輸入角色類型",
  errorMsg,
  disabled = false,
  disableAutoCreate = false,
}: RoleTypeSelectorProps) {
  // 預先載入useRoleType hook
  const roleTypeAction = useRoleType();

  // 數據管理
  const { roleTypes, isLoading, loading, refreshRoleTypes } = useRoleTypeData();

  // 輸入管理
  const {
    isCustomSelected,
    setIsCustomSelected,
    inputValue,
    setInputValue,
    descriptionValue,
    setDescriptionValue,
    codeValue,
    setCodeValue,
    handleChangeOption,
    handleInputChange,
    handleDescriptionChange,
    handleCodeChange,
    handleKeyDown,
    resetAllInputs,
    isCreating,
  } = useRoleTypeInput(
    roleTypeId,
    customValue,
    roleTypes,
    onChange,
    disableAutoCreate,
  );

  // 選項管理
  const { isNewRoleType, getCurrentValue, getEnhancedOptions } =
    useRoleTypeOptions(
      roleTypeId,
      roleTypes,
      isCustomSelected,
      inputValue,
      customValue,
    );

  // 是否顯示載入中
  const showLoading = isLoading || loading || isCreating;
  // 當前選中值
  const currentValue = getCurrentValue();
  // 選項列表
  const options = getEnhancedOptions();
  // 是否顯示自定義表單
  const showCustomForm = isCustomSelected && isNewRoleType();

  // 處理創建並選擇角色類型
  const handleCreateAndSelect = async () => {
    if (!inputValue.trim()) return;

    // 創建新角色類型
    const newRoleType = await roleTypeAction.createNewRoleType(
      inputValue,
      codeValue,
      descriptionValue,
    );

    if (newRoleType) {
      // 刷新角色類型列表
      await refreshRoleTypes();

      // 更新UI狀態以反映新選擇的角色類型
      setIsCustomSelected(false);
      setInputValue(newRoleType.name);
      setCodeValue(newRoleType.code || "");

      // 直接調用onChange傳遞新創建的角色ID
      onChange(newRoleType);
    }
  };

  return (
    <Box component="section" sx={{ position: "relative", overflow: "visible" }}>
      <SelectorLabel label={label} />

      {showLoading ? (
        <>
          <LoadingIndicator />
          <Box mt={1}>
            <small style={{ color: "#666" }}>
              {isLoading
                ? "加載角色類型中..."
                : loading
                  ? "API請求處理中..."
                  : isCreating
                    ? "創建角色類型中..."
                    : "載入中..."}
            </small>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <RoleTypeInput
              currentValue={currentValue}
              inputValue={inputValue}
              options={options}
              placeholder={placeholder}
              errorMsg={errorMsg}
              disabled={disabled || isCreating}
              onChangeOption={handleChangeOption}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onCreateClick={handleCreateAndSelect}
              showAddButton={isCustomSelected && !!inputValue.trim()}
              isCreating={roleTypeAction.isCreating}
            />
          </Box>

          <CustomRoleInputForm
            visible={showCustomForm}
            inputValue={inputValue}
            codeValue={codeValue}
            descriptionValue={descriptionValue}
            onCodeChange={handleCodeChange}
            onDescriptionChange={handleDescriptionChange}
          />
        </>
      )}
    </Box>
  );
}
