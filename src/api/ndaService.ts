import { ACCESS_TOKEN, API_URL } from "@shared/utils/utils";
import axios from "axios";
import { toast } from "react-toastify";
export type NdaTemplateType = "NDA" | "TEAM";

export interface NdaTemplate {
  id: number;
  name: string;
  description: string;
  type: NdaTemplateType;
  companyId: number | null;
  isSystemTemplate: boolean;
  defaultExpirationDays: number;
  isActive: boolean;
  content: string;
}

export interface CreateNdaTemplateRequest {
  name: string;
  description: string;
  type: NdaTemplateType;
  content: string;
  defaultExpirationDays?: number;
}

export interface UpdateNdaTemplateRequest {
  name?: string;
  description?: string;
  type?: NdaTemplateType;
  content?: string;
  defaultExpirationDays?: number;
  isActive?: boolean;
}

// 獲取 NDA 模板列表
export const getNdaTemplates = async (type?: NdaTemplateType) => {
  try {
    const params = type ? { type } : undefined;
    const response = await axios.get(`${API_URL}/nda-templates`, {
      params,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });

    if (response.status !== 200) {
      toast("獲取NDA模板列表失敗", { type: "error" });
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("獲取NDA模板列表失敗:", error);
    toast("獲取NDA模板列表失敗", { type: "error" });
    return [];
  }
};

// 創建新的 NDA 模板
export const createNdaTemplate = async (template: CreateNdaTemplateRequest) => {
  try {
    const response = await axios.post(`${API_URL}/nda-templates`, template, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });

    if (response.status !== 201) {
      toast("創建NDA模板失敗", { type: "error" });
      return null;
    }

    toast("成功創建NDA模板", { type: "success", autoClose: 1000 });
    return response.data;
  } catch (error) {
    console.error("創建NDA模板失敗:", error);
    toast("創建NDA模板失敗", { type: "error" });
    return null;
  }
};

// 更新 NDA 模板
export const updateNdaTemplate = async (
  id: number,
  template: UpdateNdaTemplateRequest,
) => {
  try {
    const response = await axios.patch(
      `${API_URL}/nda-templates/${id}`,
      template,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      },
    );

    if (response.status !== 200) {
      toast("更新NDA模板失敗", { type: "error" });
      return null;
    }

    toast("成功更新NDA模板", { type: "success", autoClose: 1000 });
    return response.data;
  } catch (error) {
    console.error("更新NDA模板失敗:", error);
    toast("更新NDA模板失敗", { type: "error" });
    return null;
  }
};
