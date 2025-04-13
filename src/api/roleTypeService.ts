import axios, { AxiosResponse } from "axios";
import type { RoleTypeDto } from "@dto/roleType";
import { API_URL, ACCESS_TOKEN } from "@shared/utils/utils";
import { toast } from "react-toastify";

export interface CreateRoleTypeParams {
  name: string;
  code: string;
  description?: string;
}

export const roleTypeService = {
  /**
   * 獲取所有角色類型列表
   */
  async getRoleTypes(): Promise<RoleTypeDto[]> {
    try {
      const response: AxiosResponse<RoleTypeDto[]> = await axios.get(
        `${API_URL}/role-types`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("獲取角色類型列表失敗:", error);
      toast("獲取角色類型列表失敗", { type: "error" });
      throw error;
    }
  },

  /**
   * 根據ID獲取角色類型
   */
  async getRoleTypeById(id: number): Promise<RoleTypeDto> {
    try {
      const response: AxiosResponse<RoleTypeDto> = await axios.get(
        `${API_URL}/role-types/${id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`獲取角色類型ID: ${id} 失敗:`, error);
      toast(`獲取角色類型ID: ${id} 失敗`, { type: "error" });
      throw error;
    }
  },

  /**
   * 創建新角色類型
   */
  async createRoleType(params: CreateRoleTypeParams): Promise<RoleTypeDto> {
    try {
      const response: AxiosResponse<RoleTypeDto> = await axios.post(
        `${API_URL}/role-types`,
        params,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );
      toast("成功創建角色類型", { type: "success", autoClose: 1000 });
      return response.data;
    } catch (error) {
      console.error("創建角色類型失敗:", error);
      toast("創建角色類型失敗", { type: "error" });
      throw error;
    }
  },

  /**
   * 更新角色類型
   */
  async updateRoleType(
    id: number,
    params: Partial<CreateRoleTypeParams>,
  ): Promise<RoleTypeDto> {
    try {
      const response: AxiosResponse<RoleTypeDto> = await axios.patch(
        `${API_URL}/role-types/${id}`,
        params,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );
      toast("成功更新角色類型", { type: "success", autoClose: 1000 });
      return response.data;
    } catch (error) {
      console.error(`更新角色類型ID: ${id} 失敗:`, error);
      toast(`更新角色類型ID: ${id} 失敗`, { type: "error" });
      throw error;
    }
  },

  /**
   * 刪除角色類型
   */
  async deleteRoleType(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/role-types/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });
      toast("成功刪除角色類型", { type: "success", autoClose: 1000 });
    } catch (error) {
      console.error(`刪除角色類型ID: ${id} 失敗:`, error);
      toast(`刪除角色類型ID: ${id} 失敗`, { type: "error" });
      throw error;
    }
  },
};
