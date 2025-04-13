import axios from "axios";
import { toast } from "react-toastify";
import { API_URL, ACCESS_TOKEN } from "@shared/utils/utils";
import type {
  CreateCompanyDto,
  UpdateCompanyDto,
  CompanyResponseDto,
  CompanyWithUsersResponseDto,
} from "@dto/company";

export default class CompanyService {
  public static readonly keys = {
    companies: "companies",
    company: "company",
    companyWithUsers: "company-with-users",
  };

  public static readonly getCompanies = async (): Promise<
    CompanyResponseDto[]
  > => {
    const result = await axios.get(`${API_URL}/companies`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });

    if (result.status !== 200) {
      toast("獲取公司列表失敗", { type: "error" });
      return [];
    }

    return result.data;
  };

  public static readonly getCompany = async (
    id: number,
  ): Promise<CompanyResponseDto | null> => {
    try {
      const result = await axios.get(`${API_URL}/companies/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });

      if (result.status !== 200) {
        toast("獲取公司資訊失敗", { type: "error" });
        return null;
      }

      return result.data;
    } catch (error) {
      toast("獲取公司資訊失敗", { type: "error" });
      return null;
    }
  };

  public static readonly getCompanyWithUsers = async (
    id: number,
  ): Promise<CompanyWithUsersResponseDto | null> => {
    try {
      const result = await axios.get(`${API_URL}/companies/${id}/with-users`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });

      if (result.status !== 200) {
        toast("獲取公司及其使用者資訊失敗", { type: "error" });
        return null;
      }

      return result.data;
    } catch (error) {
      toast("獲取公司及其使用者資訊失敗", { type: "error" });
      return null;
    }
  };

  public static readonly createCompany = async (
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseDto | null> => {
    try {
      const result = await axios.post(
        `${API_URL}/companies`,
        createCompanyDto,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );

      if (result.status !== 201) {
        toast("創建公司失敗", { type: "error" });
        return null;
      }

      toast("成功創建公司", { type: "success", autoClose: 1000 });
      return result.data;
    } catch (error) {
      toast("創建公司失敗", { type: "error" });
      return null;
    }
  };

  public static readonly updateCompany = async (
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyResponseDto | null> => {
    try {
      const result = await axios.put(
        `${API_URL}/companies/${id}`,
        updateCompanyDto,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );

      if (result.status !== 200) {
        toast("更新公司資訊失敗", { type: "error" });
        return null;
      }

      toast("成功更新公司資訊", { type: "success", autoClose: 1000 });
      return result.data;
    } catch (error) {
      toast("更新公司資訊失敗", { type: "error" });
      return null;
    }
  };

  public static readonly deleteCompany = async (
    id: number,
  ): Promise<boolean> => {
    try {
      const result = await axios.delete(`${API_URL}/companies/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });

      if (result.status !== 200) {
        toast("刪除公司失敗", { type: "error" });
        return false;
      }

      toast("成功刪除公司", { type: "success", autoClose: 1000 });
      return true;
    } catch (error) {
      toast("刪除公司失敗", { type: "error" });
      return false;
    }
  };
}
