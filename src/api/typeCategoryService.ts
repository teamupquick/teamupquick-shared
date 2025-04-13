import { ACCESS_TOKEN, API_URL } from "@shared/utils/utils";
import axios from "axios";
import type {
  TypeCategoryResponseDto,
  TypeCategoryQueryParams,
  CreateTypeCategoryDto,
} from "@dto/typeCategory";

// 導出接口
export interface TypeCategoryServiceResponse {
  data: TypeCategoryResponseDto[];
}

export default class TypeCategoryService {
  public static readonly keys = {
    typeCategories: "type-categories",
  };

  private static readonly buildCacheKey = (
    endpoint: string,
    params?: TypeCategoryQueryParams,
  ) => {
    return `${endpoint}:${JSON.stringify(params || {})}`;
  };

  public static readonly getTypeCategories = async (
    params?: TypeCategoryQueryParams,
  ): Promise<TypeCategoryResponseDto[]> => {
    const apiEndpoint = `${API_URL}/type-categories`;

    try {
      const result = await axios(apiEndpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
        params,
      });

      return result.data;
    } catch (error: unknown) {
      console.error(
        `[TypeCategoryService] getTypeCategories() 失敗，錯誤:`,
        error,
      );
      if (axios.isAxiosError(error)) {
        console.error(`[TypeCategoryService] 請求配置:`, error.config);
        console.error(
          `[TypeCategoryService] 響應狀態: ${error.response?.status}`,
        );
        console.error(
          `[TypeCategoryService] 響應數據: ${JSON.stringify(error.response?.data)}`,
        );
      }
      if (error instanceof Error) {
        console.error(`[TypeCategoryService] 錯誤消息: ${error.message}`);
        console.error(`[TypeCategoryService] 錯誤堆棧: ${error.stack}`);
      }
      return [];
    }
  };

  // 獲取項目類別
  public static readonly getProjectCategories = async (): Promise<
    TypeCategoryResponseDto[]
  > => {
    return this.getTypeCategories({
      level: "PROJECT",
      onlyActive: true,
    });
  };

  // 獲取里程碑類別
  public static readonly getMilestoneCategories = async (): Promise<
    TypeCategoryResponseDto[]
  > => {
    return this.getTypeCategories({
      level: "MILESTONE",
      onlyActive: true,
    });
  };

  // 獲取任務類別
  public static readonly getTaskCategories = async (): Promise<
    TypeCategoryResponseDto[]
  > => {
    return this.getTypeCategories({
      level: "TASK",
      onlyActive: true,
    });
  };

  // 獲取子任務類別
  public static readonly getSubTaskCategories = async (): Promise<
    TypeCategoryResponseDto[]
  > => {
    return this.getTypeCategories({
      level: "SUBTASK",
      onlyActive: true,
    });
  };

  // 獲取子類別
  public static readonly getChildCategories = async (
    parentId: number,
  ): Promise<TypeCategoryResponseDto[]> => {
    return this.getTypeCategories({
      parentId,
      onlyActive: true,
    });
  };

  // 獲取建議類別
  public static readonly getSuggestedCategories = async (
    level: string,
    appliesTo?: string,
  ): Promise<TypeCategoryResponseDto[]> => {
    return this.getTypeCategories({
      level,
      appliesTo,
      onlyActive: true,
    });
  };

  // 獲取單個類別
  public static readonly getCategory = async (
    id: number,
  ): Promise<TypeCategoryResponseDto> => {
    return this.getTypeCategory(id);
  };

  public static readonly getTypeCategory = async (
    id: number,
  ): Promise<TypeCategoryResponseDto> => {
    const apiEndpoint = `${API_URL}/type-categories/${id}`;

    try {
      const result = await axios(apiEndpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });

      return result.data;
    } catch (error) {
      console.error(
        `[TypeCategoryService] 獲取類別失敗，id: ${id}，錯誤:`,
        error,
      );
      if (axios.isAxiosError(error)) {
        console.error(
          `[TypeCategoryService] 響應狀態: ${error.response?.status}`,
        );
        console.error(
          `[TypeCategoryService] 響應數據: ${JSON.stringify(error.response?.data)}`,
        );
        console.error(`[TypeCategoryService] 請求配置:`, error.config);
      }
      throw error;
    }
  };

  // 創建類別
  public static readonly createCategory = async (
    categoryReq: CreateTypeCategoryDto,
  ): Promise<TypeCategoryResponseDto> => {
    return this.createTypeCategory(categoryReq);
  };

  public static readonly createTypeCategory = async (
    categoryReq: CreateTypeCategoryDto,
  ): Promise<TypeCategoryResponseDto> => {
    const apiEndpoint = `${API_URL}/type-categories`;

    try {
      const result = await axios(apiEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
        data: categoryReq,
      });

      return result.data;
    } catch (error) {
      console.error(`[TypeCategoryService] 創建類別失敗，錯誤:`, error);
      if (axios.isAxiosError(error)) {
        console.error(
          `[TypeCategoryService] 響應狀態: ${error.response?.status}`,
        );
        console.error(
          `[TypeCategoryService] 響應數據: ${JSON.stringify(error.response?.data)}`,
        );
        console.error(`[TypeCategoryService] 請求配置:`, error.config);
      }
      throw error;
    }
  };

  public static readonly updateTypeCategory = async (
    id: number,
    categoryReq: CreateTypeCategoryDto,
  ): Promise<TypeCategoryResponseDto> => {
    const apiEndpoint = `${API_URL}/type-categories/${id}`;

    try {
      const result = await axios(apiEndpoint, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
        data: categoryReq,
      });

      return result.data;
    } catch (error) {
      console.error(`更新類別失敗，id: ${id}，錯誤:`, error);
      if (axios.isAxiosError(error)) {
        console.error(`響應狀態: ${error.response?.status}`);
        console.error(`響應數據: ${JSON.stringify(error.response?.data)}`);
      }
      throw error;
    }
  };

  public static readonly deleteTypeCategory = async (
    id: number,
  ): Promise<void> => {
    const apiEndpoint = `${API_URL}/type-categories/${id}`;

    try {
      await axios(apiEndpoint, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });
    } catch (error) {
      console.error(`刪除類別失敗，id: ${id}，錯誤:`, error);
      if (axios.isAxiosError(error)) {
        console.error(`響應狀態: ${error.response?.status}`);
        console.error(`響應數據: ${JSON.stringify(error.response?.data)}`);
      }
      throw error;
    }
  };
}
