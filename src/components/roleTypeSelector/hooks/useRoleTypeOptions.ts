import { useCallback } from "react";
import type { RoleTypeDto } from "@dto/roleType";
import type { RoleTypeOption } from "../types";

/**
 * 管理角色類型選項的Hook
 * 負責處理選項列表和當前選擇狀態
 */
export function useRoleTypeOptions(
  roleTypeId: number | null,
  roleTypes: RoleTypeDto[],
  isCustomSelected: boolean,
  inputValue: string,
  customValue: string,
) {
  // 檢查選擇的角色類型是否為新類型
  const isNewRoleType = useCallback(() => {
    if (!isCustomSelected || !inputValue.trim()) return false;

    return !roleTypes.some(
      (roleType) => roleType.name.toLowerCase() === inputValue.toLowerCase(),
    );
  }, [isCustomSelected, inputValue, roleTypes]);

  // 獲取當前選中值
  const getCurrentValue = useCallback((): RoleTypeOption | null => {
    if (isCustomSelected) {
      return { label: customValue || inputValue, value: "OTHER" };
    }

    if (roleTypeId) {
      const selectedRoleType = roleTypes.find((role) => role.id === roleTypeId);
      if (selectedRoleType) {
        return {
          label: selectedRoleType.name,
          value: selectedRoleType.id.toString(),
        };
      } else {
        return {
          label: `角色類型 #${roleTypeId}`,
          value: roleTypeId.toString(),
        };
      }
    }

    return null;
  }, [isCustomSelected, customValue, inputValue, roleTypeId, roleTypes]);

  // 獲取特定角色類型選項
  const getRoleTypeOption = useCallback(
    (id: number): RoleTypeOption | null => {
      if (!id) return null;

      const roleType = roleTypes.find((role) => role.id === id);
      if (!roleType) return null;

      return {
        value: roleType.id.toString(),
        label: roleType.name,
        userData: roleType,
        description: roleType.description || "",
      };
    },
    [roleTypes],
  );

  // 準備完整的選項列表
  const getEnhancedOptions = useCallback((): RoleTypeOption[] => {
    // 基本選項列表
    const options = roleTypes.map((roleType) => ({
      value: roleType.id.toString(),
      label: roleType.name,
      description: roleType.description || "",
      userData: roleType,
    }));

    // 如果當前選中ID不在列表中，添加它
    if (
      roleTypeId &&
      !options.some((opt) => opt.value === roleTypeId.toString())
    ) {
      const option = getRoleTypeOption(roleTypeId);
      if (option) {
        options.push({
          value: option.value,
          label: option.label,
          description: option.description || "",
          userData: option.userData as RoleTypeDto,
        });
      }
    }

    // 添加自定義選項
    options.push({
      value: "OTHER",
      label: "其他 (自定義)",
      description: "",
      userData: {} as RoleTypeDto,
    });

    return options;
  }, [roleTypes, roleTypeId, getRoleTypeOption]);

  return {
    isNewRoleType,
    getCurrentValue,
    getEnhancedOptions,
  };
}
