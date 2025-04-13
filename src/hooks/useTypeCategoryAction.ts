import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import TypeCategoryService from "../api/typeCategoryService";
import type {
  TypeCategoryResponseDto,
  CreateTypeCategoryDto,
} from "@dto/typeCategory";

interface UseTypeCategoryReturn {
  loading: boolean;
  projectCategories: TypeCategoryResponseDto[];
  milestoneCategories: TypeCategoryResponseDto[];
  taskCategories: TypeCategoryResponseDto[];
  subTaskCategories: TypeCategoryResponseDto[];
  getProjectCategories: () => Promise<TypeCategoryResponseDto[]>;
  getMilestoneCategories: () => Promise<TypeCategoryResponseDto[]>;
  getTaskCategories: () => Promise<TypeCategoryResponseDto[]>;
  getSubTaskCategories: () => Promise<TypeCategoryResponseDto[]>;
  getChildCategories: (parentId: number) => Promise<TypeCategoryResponseDto[]>;
  getSuggestedCategories: (
    defaultParentCategoryId: number,
    level: string,
  ) => Promise<TypeCategoryResponseDto[]>;
  getCategoryById: (id: number) => Promise<TypeCategoryResponseDto | undefined>;
  createCategory: (
    data: CreateTypeCategoryDto,
  ) => Promise<TypeCategoryResponseDto | null>;
}

export function useTypeCategory(): UseTypeCategoryReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [projectCategories, setProjectCategories] = useState<
    TypeCategoryResponseDto[]
  >([]);
  const [milestoneCategories, setMilestoneCategories] = useState<
    TypeCategoryResponseDto[]
  >([]);
  const [taskCategories, setTaskCategories] = useState<
    TypeCategoryResponseDto[]
  >([]);
  const [subTaskCategories, setSubTaskCategories] = useState<
    TypeCategoryResponseDto[]
  >([]);
  const [categoriesMap, setCategoriesMap] = useState<
    Map<number, TypeCategoryResponseDto>
  >(new Map());

  // 追蹤組件是否已初始化過類別資料
  const initializedRef = useRef({
    project: false,
    milestone: false,
    task: false,
    subtask: false,
  });

  // 獲取專案類別
  const getProjectCategories = useCallback(async () => {
    // 如果已經有數據且正在加載中，不重複請求
    if (projectCategories.length > 0 && loading) {
     
      return projectCategories;
    }

    try {
      setLoading(true);
      const categories = await TypeCategoryService.getProjectCategories();


      setProjectCategories(categories);

      // 更新 categoriesMap
      const newMap = new Map(categoriesMap);
      categories.forEach((category: TypeCategoryResponseDto) =>
        newMap.set(category.id, category),
      );
      setCategoriesMap(newMap);

      // 標記已初始化
      initializedRef.current.project = true;
      
      return categories;
    } catch (error) {
      console.error("獲取專案類別失敗，詳細錯誤:", error);
      toast.error("獲取專案類別失敗");
      return [];
    } finally {
      
      setLoading(false);
    }
  }, [categoriesMap, loading, projectCategories]);

  // 獲取里程碑類別
  const getMilestoneCategories = useCallback(async () => {
    // 如果已經有數據且正在加載中，不重複請求
    if (milestoneCategories.length > 0 && loading) {
      return milestoneCategories;
    }

    try {
      setLoading(true);
      const categories = await TypeCategoryService.getMilestoneCategories();
      setMilestoneCategories(categories);

      // 更新 categoriesMap
      const newMap = new Map(categoriesMap);
      categories.forEach((category: TypeCategoryResponseDto) =>
        newMap.set(category.id, category),
      );
      setCategoriesMap(newMap);

      // 標記已初始化
      initializedRef.current.milestone = true;

      return categories;
    } catch (error) {
      toast.error("獲取里程碑類別失敗");
      return [];
    } finally {
      setLoading(false);
    }
  }, [categoriesMap, loading, milestoneCategories]);

  // 獲取任務類別
  const getTaskCategories = useCallback(async () => {
    // 如果已經有數據且正在加載中，不重複請求
    if (taskCategories.length > 0 && loading) {
      return taskCategories;
    }

    try {
      setLoading(true);
      const categories = await TypeCategoryService.getTaskCategories();
      setTaskCategories(categories);

      // 更新 categoriesMap
      const newMap = new Map(categoriesMap);
      categories.forEach((category: TypeCategoryResponseDto) =>
        newMap.set(category.id, category),
      );
      setCategoriesMap(newMap);

      // 標記已初始化
      initializedRef.current.task = true;

      return categories;
    } catch (error) {
      toast.error("獲取任務類別失敗");
      return [];
    } finally {
      setLoading(false);
    }
  }, [categoriesMap, loading, taskCategories]);

  // 獲取子任務類別
  const getSubTaskCategories = useCallback(async () => {
    // 如果已經有數據且正在加載中，不重複請求
    if (subTaskCategories.length > 0 && loading) {
      return subTaskCategories;
    }

    try {
      setLoading(true);
      const categories = await TypeCategoryService.getSubTaskCategories();
      setSubTaskCategories(categories);

      // 更新 categoriesMap
      const newMap = new Map(categoriesMap);
      categories.forEach((category: TypeCategoryResponseDto) =>
        newMap.set(category.id, category),
      );
      setCategoriesMap(newMap);

      // 標記已初始化
      initializedRef.current.subtask = true;

      return categories;
    } catch (error) {
      toast.error("獲取子任務類別失敗");
      return [];
    } finally {
      setLoading(false);
    }
  }, [categoriesMap, loading, subTaskCategories]);

  // 根據父類別ID獲取子類別
  const getChildCategories = useCallback(
    async (parentId: number) => {
      try {
        setLoading(true);
        const categories =
          await TypeCategoryService.getChildCategories(parentId);

        // 更新 categoriesMap
        const newMap = new Map(categoriesMap);
        categories.forEach((category: TypeCategoryResponseDto) =>
          newMap.set(category.id, category),
        );
        setCategoriesMap(newMap);

        return categories;
      } catch (error) {
        toast.error("獲取子類別失敗");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [categoriesMap],
  );

  // 根據上層類別ID獲取建議的下層類別
  const getSuggestedCategories = useCallback(
    async (defaultParentCategoryId: number, level: string) => {
      try {
        setLoading(true);
        const categories = await TypeCategoryService.getSuggestedCategories(
          level,
          defaultParentCategoryId.toString(),
        );

        // 更新 categoriesMap
        const newMap = new Map(categoriesMap);
        categories.forEach((category: TypeCategoryResponseDto) =>
          newMap.set(category.id, category),
        );
        setCategoriesMap(newMap);

        return categories;
      } catch (error) {
        toast.error("獲取建議類別失敗");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [categoriesMap],
  );

  // 根據ID獲取類別
  const getCategoryById = useCallback(
    async (id: number) => {
      // 先從本地 Map 查詢
      if (categoriesMap.has(id)) {
        return categoriesMap.get(id);
      }

      // 如果本地沒有，則從API獲取
      try {
        setLoading(true);
        const category = await TypeCategoryService.getCategory(id);

        // 若API返回null，則直接返回undefined
        if (!category) {
          return undefined;
        }

        // 更新 categoriesMap
        const newMap = new Map(categoriesMap);
        newMap.set(category.id, category);
        setCategoriesMap(newMap);

        return category;
      } catch (error) {
        toast.error("獲取類別詳情失敗");
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [categoriesMap],
  );

  // 創建新類別
  const createCategory = useCallback(async (data: CreateTypeCategoryDto) => {
    try {
      setLoading(true);
      const newCategory = await TypeCategoryService.createCategory(data);

      if (!newCategory) {
        toast.error("創建類別失敗，API返回null");
        return null;
      }

      // 更新相應類別列表
      const updateCategoryList = () => {
        const level = data.level;
        if (level === "PROJECT") {
          setProjectCategories((prevCategories) => {
            // 添加新類別並按規則排序
            const newCategories = [...prevCategories, newCategory];
            return sortCategories(newCategories);
          });
        } else if (level === "MILESTONE") {
          setMilestoneCategories((prevCategories) => {
            const newCategories = [...prevCategories, newCategory];
            return sortCategories(newCategories);
          });
        } else if (level === "TASK") {
          setTaskCategories((prevCategories) => {
            const newCategories = [...prevCategories, newCategory];
            return sortCategories(newCategories);
          });
        } else if (level === "SUBTASK") {
          setSubTaskCategories((prevCategories) => {
            const newCategories = [...prevCategories, newCategory];
            return sortCategories(newCategories);
          });
        }
      };

      // 對類別列表進行排序
      const sortCategories = (categories: TypeCategoryResponseDto[]) => {
        return [...categories].sort((a, b) => {
          // 系統預設類別優先顯示
          if (a.isSystem && !b.isSystem) return -1;
          if (!a.isSystem && b.isSystem) return 1;

          // 按照 sortOrder 排序
          if (a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
          }

          // 如果 sortOrder 相同，則按照創建時間排序，較舊的優先
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
      };

      updateCategoryList();

      // 更新categoriesMap
      setCategoriesMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(newCategory.id, newCategory);
        return newMap;
      });

      return newCategory;
    } catch (error) {
      toast.error("創建類別發生異常");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 不再主動初始化所有類別，改為按需加載
  // 不使用useEffect自動加載，由使用者調用各個get方法時加載

  return {
    loading,
    projectCategories,
    milestoneCategories,
    taskCategories,
    subTaskCategories,
    getProjectCategories,
    getMilestoneCategories,
    getTaskCategories,
    getSubTaskCategories,
    getChildCategories,
    getSuggestedCategories,
    getCategoryById,
    createCategory,
  };
}
