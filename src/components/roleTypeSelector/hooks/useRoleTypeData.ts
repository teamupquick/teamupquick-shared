import { useState, useEffect, useRef } from "react";
import { useRoleType } from "@shared/hooks/useRoleTypeAction";
import type { RoleTypeDto } from "@dto/roleType";

/**
 * 管理角色類型數據的Hook
 * 負責載入和提供角色類型列表
 */
export function useRoleTypeData() {
  const [roleTypes, setRoleTypes] = useState<RoleTypeDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);
  const { loading, getRoleTypes } = useRoleType();
  const loadedRef = useRef(false);

  // 確保組件卸載後不再設置狀態
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 首次加載時獲取角色類型數據
  useEffect(() => {
    // 如果已經載入過，則不重複載入
    if (loadedRef.current) {
      return;
    }

    // 立即加載角色類型
    handleLoadRoleTypes();
    loadedRef.current = true;
  }, []);

  // 加載角色類型數據
  const handleLoadRoleTypes = async () => {
    // 如果組件已卸載，不進行操作
    if (!isMountedRef.current) {
      return [];
    }

    try {
      setIsLoading(true);
      const result = await getRoleTypes();

      if (isMountedRef.current) {
        setRoleTypes(result);
        setIsLoading(false);
      }
      return result;
    } catch (error) {
      // 只有在組件仍然掛載時才設置狀態
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return [];
    }
  };

  // 刷新角色類型列表
  const refreshRoleTypes = async () => {
    // 重置loadedRef以確保重新加載
    loadedRef.current = false;
    return await handleLoadRoleTypes();
  };

  return {
    roleTypes,
    setRoleTypes,
    isLoading,
    loading,
    handleLoadRoleTypes,
    refreshRoleTypes,
  };
}
