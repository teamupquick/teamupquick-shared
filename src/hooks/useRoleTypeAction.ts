import { useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";

import type { RoleTypeDto } from "@dto/roleType";
import { roleTypeService } from "../api/roleTypeService";

// 聲明全局變量
declare global {
  interface Window {
    lastCreatedRoleTypeIds: Record<string, number | null>;
  }
}

// 全局變量，確保跨組件共享狀態
let globalRoleTypes: RoleTypeDto[] = [];
let hasInitialized = false;

// 初始化全局變量
if (!window.lastCreatedRoleTypeIds) {
  window.lastCreatedRoleTypeIds = {};
}

interface UseRoleTypeReturn {
  loading: boolean;
  roleTypes: RoleTypeDto[];
  getRoleTypes: () => Promise<RoleTypeDto[]>;
  getRoleTypeById: (id: number) => Promise<RoleTypeDto | undefined>;
  createRoleType: (data: RoleTypeDto) => Promise<RoleTypeDto | null>;

  // 自定義角色相關功能
  isCreating: boolean;
  createNewRoleType: (
    name: string,
    code: string,
    description?: string,
  ) => Promise<RoleTypeDto | null>;
  getLastCreatedRoleTypeId: (level: string) => number | null;
  setLastCreatedRoleTypeId: (level: string, id: number | null) => void;
  clearLastCreatedRoleTypeId: (level: string) => void;
  clearAllRoleTypeIds: () => void;

  // 空函數，維持API兼容性
  persistRoleTypeData: () => void;
  restoreRoleTypeData: () => void;
}

export function useRoleType(): UseRoleTypeReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [roleTypes, setRoleTypes] = useState<RoleTypeDto[]>(globalRoleTypes);
  const [roleTypesMap, setRoleTypesMap] = useState<Map<number, RoleTypeDto>>(
    new Map(),
  );
  const [isCreating, setIsCreating] = useState(false);

  // 追蹤組件是否已初始化過角色類型資料
  const initializedRef = useRef({
    roleType: hasInitialized,
  });

  // 獲取角色類型
  const getRoleTypes = useCallback(async () => {
    // 如果已經有數據且正在加載中，不重複請求
    if (roleTypes.length > 0 && loading) {
      return roleTypes;
    }

    try {
      setLoading(true);
      const roles = await roleTypeService.getRoleTypes();
      setRoleTypes(roles);
      globalRoleTypes = roles;

      // 更新 roleTypesMap
      const newMap = new Map(roleTypesMap);
      roles.forEach((role: RoleTypeDto) => newMap.set(role.id, role));
      setRoleTypesMap(newMap);

      // 標記已初始化
      initializedRef.current.roleType = true;
      hasInitialized = true;

      return roles;
    } catch (error) {
      toast.error("獲取角色類型失敗");
      return [];
    } finally {
      setLoading(false);
    }
  }, [roleTypesMap, loading, roleTypes]);

  // 根據ID獲取角色類型
  const getRoleTypeById = useCallback(
    async (id: number) => {
      // 先從本地 Map 查詢
      if (roleTypesMap.has(id)) {
        return roleTypesMap.get(id);
      }

      // 如果本地沒有，則從API獲取
      try {
        setLoading(true);
        const roleType = await roleTypeService.getRoleTypeById(id);
        // 若API返回null，則直接返回undefined
        if (!roleType) {
          return undefined;
        }

        // 更新 roleTypesMap
        const newMap = new Map(roleTypesMap);
        newMap.set(roleType.id, roleType);
        setRoleTypesMap(newMap);

        return roleType;
      } catch (error) {
        toast.error("獲取角色類型詳情失敗");
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [roleTypesMap],
  );

  // 創建新角色類型
  const createRoleType = useCallback(async (data: RoleTypeDto) => {
    try {
      setLoading(true);
      // 將 RoleTypeDto 轉換為 CreateRoleTypeParams
      const params = {
        name: data.name,
        code: data.code,
        description: data.description,
      };

      const newRoleType = await roleTypeService.createRoleType(params);

      if (!newRoleType) {
        toast.error("創建角色類型失敗，API返回null");
        return null;
      }

      // 更新角色類型列表
      const updateRoleTypeList = () => {
        setRoleTypes((prevRoleTypes) => {
          // 添加新角色類型並按規則排序
          const newRoleTypes = [...prevRoleTypes, newRoleType];
          const sorted = sortRoleTypes(newRoleTypes);
          globalRoleTypes = sorted;
          return sorted;
        });
      };

      // 對角色類型列表進行排序
      const sortRoleTypes = (roleTypes: RoleTypeDto[]) => {
        return [...roleTypes].sort((a, b) => {
          // 系統預設角色類型優先顯示
          if (a.isCustom && !b.isCustom) return -1;
          if (!a.isCustom && b.isCustom) return 1;

          // 按照 id 排序
          if (a.id !== b.id) {
            return a.id - b.id;
          }

          // 如果 id 相同，則按照創建時間排序，較舊的優先
          return (
            (a.createdAt ? new Date(a.createdAt).getTime() : 0) -
            (b.createdAt ? new Date(b.createdAt).getTime() : 0)
          );
        });
      };

      updateRoleTypeList();

      // 更新roleTypesMap
      setRoleTypesMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(newRoleType.id, newRoleType);
        return newMap;
      });

      return newRoleType;
    } catch (error) {
      toast.error("創建角色類型發生異常");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 創建新的自定義角色類型 (來自useCustomRoleType)
  const createNewRoleType = useCallback(
    async (
      name: string,
      code: string,
      description?: string,
    ): Promise<RoleTypeDto | null> => {
      if (!name.trim()) {
        return null;
      }

      setIsCreating(true);

      try {
        const roleTypeData: RoleTypeDto = {
          id: 0,
          name: name.trim(),
          code: code?.trim() || name.trim().toUpperCase().replace(/ /g, "_"),
          description: description?.trim() || name.trim(),
          isCustom: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const newRoleType = await createRoleType(roleTypeData);

        if (newRoleType) {
          window.lastCreatedRoleTypeIds["PROJECT"] = newRoleType.id;
          return newRoleType;
        }

        return null;
      } catch (error) {
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [createRoleType],
  );

  // 獲取上次創建的角色類型 ID
  const getLastCreatedRoleTypeId = useCallback(
    (level: string): number | null => {
      return window.lastCreatedRoleTypeIds[level] || null;
    },
    [],
  );

  // 設置角色類型 ID
  const setLastCreatedRoleTypeId = useCallback(
    (level: string, id: number | null) => {
      window.lastCreatedRoleTypeIds[level] = id;
    },
    [],
  );

  // 清除指定級別的角色類型 ID
  const clearLastCreatedRoleTypeId = useCallback((level: string) => {
    window.lastCreatedRoleTypeIds[level] = null;
  }, []);

  // 清除所有級別的角色類型 ID
  const clearAllRoleTypeIds = useCallback(() => {
    window.lastCreatedRoleTypeIds = {};
  }, []);

  return {
    loading,
    roleTypes,
    getRoleTypes,
    getRoleTypeById,
    createRoleType,
    isCreating,
    createNewRoleType,
    getLastCreatedRoleTypeId,
    setLastCreatedRoleTypeId,
    clearLastCreatedRoleTypeId,
    clearAllRoleTypeIds,
    persistRoleTypeData: () => {}, // 空函數，維持API兼容性
    restoreRoleTypeData: () => {}, // 空函數，維持API兼容性
  };
}

/**
 * 創建自定義角色類型並返回其 ID
 * 此函數可在非 React 組件中使用
 */
export async function createCustomRoleType(
  name: string,
  code: string,
  description?: string,
): Promise<number | null> {
  // 如果在非 React 組件中使用，我們需要直接調用 API
  try {
    if (!name.trim()) {
      return null;
    }

    const params = {
      name: name.trim(),
      code: code?.trim() || name.trim().toUpperCase().replace(/ /g, "_"),
      description: description?.trim() || name.trim(),
    };

    const newRoleType = await roleTypeService.createRoleType(params);

    if (newRoleType) {
      // 更新全局變量儲存創建的 ID
      window.lastCreatedRoleTypeIds["PROJECT"] = newRoleType.id;
      return newRoleType.id;
    }

    return null;
  } catch (error) {
    return null;
  }
}
