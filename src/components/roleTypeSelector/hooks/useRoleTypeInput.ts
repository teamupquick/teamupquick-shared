import type { RoleTypeSelectorProps, RoleTypeOption } from "../types";
import { useState, useEffect } from "react";
import { generateRoleTypeCode } from "../utils";
import type { InputChangeHandler } from "../types";
import { createRoleTypeDto } from "@dto/roleType";
import type { RoleTypeDto } from "@dto/roleType";
import { useRoleType } from "@shared/hooks/useRoleTypeAction";

/**
 * 使用角色類型輸入邏輯
 * 處理角色類型選擇器的輸入狀態和行為
 */
export function useRoleTypeInput(
  roleTypeId: number | null,
  customValue: string,
  roleTypes: RoleTypeDto[],
  onChange: RoleTypeSelectorProps["onChange"],
  disableAutoCreate: boolean = false,
) {
  const [isCustomSelected, setIsCustomSelected] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [codeValue, setCodeValue] = useState<string>("");

  // 使用roleType hook獲取功能方法
  const roleTypeAction = useRoleType();
  const { isCreating, getLastCreatedRoleTypeId, clearLastCreatedRoleTypeId } =
    roleTypeAction;

  // 初始化和監聽變化
  useEffect(() => {
    handleInitialValue();
    checkLastCreatedRoleType();
  }, [roleTypeId, customValue, roleTypes]);

  // 處理初始值設置
  const handleInitialValue = () => {
    if (roleTypeId && roleTypeId > 0) {
      // 查找選中的角色類型
      const selectedRoleType = roleTypes.find((role) => role.id === roleTypeId);
      if (selectedRoleType) {
        setIsCustomSelected(false);
        setInputValue(selectedRoleType.name);
        setCodeValue(selectedRoleType.code || "");
      } else {
        // 如果在角色類型列表中找不到，則異步獲取
        findRoleTypeById();
      }
    } else if (customValue) {
      // 設置自定義值
      setIsCustomSelected(true);
      setInputValue(customValue);
      setCodeValue(generateRoleTypeCode(customValue));
    }
  };

  // 重置所有輸入
  const resetAllInputs = () => {
    setIsCustomSelected(false);
    setInputValue("");
    setDescriptionValue("");
    setCodeValue("");
  };

  // 在角色類型列表載入後查找角色
  const findRoleTypeById = async () => {
    if (!roleTypeId || roleTypeId <= 0) return;

    // 這裡可以根據實際情況向後端API請求獲取角色類型
    const reloadedRoleType = roleTypes.find((role) => role.id === roleTypeId);
    if (reloadedRoleType) {
      setIsCustomSelected(false);
      setInputValue(reloadedRoleType.name);
      setCodeValue(reloadedRoleType.code || "");
    }
  };

  // 檢測並處理最近創建的角色類型
  const checkLastCreatedRoleType = () => {
    if (disableAutoCreate || roleTypes.length === 0) return;

    const lastCreatedId = getLastCreatedRoleTypeId("PROJECT");
    if (!lastCreatedId || lastCreatedId <= 0) return;

    const roleType = roleTypes.find((role) => role.id === lastCreatedId);
    if (roleType) {
      setIsCustomSelected(false);
      setInputValue(roleType.name);
      setCodeValue(roleType.code || "");
      onChange(roleType);
      clearLastCreatedRoleTypeId("PROJECT");
    }
  };

  // 處理 Autocomplete 選擇變更
  const handleChangeOption = (
    _: React.SyntheticEvent,
    option: RoleTypeOption | string | null,
  ) => {
    // 處理清空選擇的情況
    if (option === null) {
      resetAllInputs();
      onChange(createRoleTypeDto(0, "", ""));
      return;
    }

    // 處理直接輸入文字的情況
    if (typeof option === "string") {
      handleStringOption(option);
      return;
    }

    // 處理選擇下拉選項的情況
    handleObjectOption(option);
  };

  // 處理字串類型的選項（直接輸入）
  const handleStringOption = (option: string) => {
    if (!option.trim()) {
      resetAllInputs();
      onChange(createRoleTypeDto(0, "", ""));
    } else {
      setIsCustomSelected(true);
      setInputValue(option);

      // 自動生成代碼
      const generatedCode = generateRoleTypeCode(option);
      setCodeValue(generatedCode);

      onChange(createRoleTypeDto(0, option, generatedCode));
    }
  };

  // 處理物件類型的選項（下拉選擇）
  const handleObjectOption = (option: RoleTypeOption) => {
    if (option.value === "OTHER") {
      // 選擇"其他"選項
      setIsCustomSelected(true);
      setInputValue("");
      setCodeValue("");
      onChange(createRoleTypeDto(0, "", ""));
    } else {
      // 選擇現有角色類型
      const roleTypeId = parseInt(option.value, 10);
      setIsCustomSelected(false);
      setInputValue(option.label);

      // 設置選中角色類型的code
      const selectedRole = roleTypes.find((role) => role.id === roleTypeId);
      const code = selectedRole?.code || generateRoleTypeCode(option.label);
      setCodeValue(code);

      // 如果在選項中有完整的角色類型數據，則傳遞它
      if (option.userData) {
        onChange(option.userData);
      } else if (selectedRole) {
        // 否則使用找到的角色類型
        onChange(selectedRole);
      } else {
        // 創建新的角色類型DTO
        onChange(createRoleTypeDto(roleTypeId, option.label, code));
      }
    }
  };

  // 處理輸入變更
  const handleInputChange = (
    _: React.SyntheticEvent,
    newInputValue: string,
  ) => {
    setInputValue(newInputValue);

    if (isCustomSelected) {
      if (!newInputValue.trim()) {
        resetAllInputs();
        onChange(createRoleTypeDto(0, "", ""));
        return;
      }

      // 如果code未手動設置，則自動生成
      let code = codeValue;
      if (!codeValue || codeValue === generateRoleTypeCode(inputValue)) {
        code = generateRoleTypeCode(newInputValue);
        setCodeValue(code);
      }

      onChange(createRoleTypeDto(0, newInputValue, code));
    }
  };

  // 處理描述輸入變更
  const handleDescriptionChange: InputChangeHandler = (e) => {
    const newDescription = e.target.value;
    setDescriptionValue(newDescription);

    if (isCustomSelected) {
      // 創建包含描述的角色類型DTO
      const roleTypeDto = createRoleTypeDto(0, inputValue, codeValue);
      roleTypeDto.description = newDescription;
      onChange(roleTypeDto);
    }
  };

  // 處理Code輸入變更
  const handleCodeChange: InputChangeHandler = (e) => {
    const newCode = e.target.value;
    setCodeValue(newCode);

    if (isCustomSelected) {
      onChange(createRoleTypeDto(0, inputValue, newCode));
    }
  };

  // 按下 Enter 鍵處理
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue && !isCustomSelected) {
      setIsCustomSelected(true);
      const code = generateRoleTypeCode(inputValue);
      setCodeValue(code);
      onChange(createRoleTypeDto(0, inputValue, code));
    }
  };

  return {
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
  };
}
