import { ACCESS_TOKEN, API_URL } from "@shared/utils/utils";
import axios from "axios";
import { toast } from "react-toastify";
import type {
  UserDto,
  UserProfileDto,
  UserSalaryDto,
  SearchedUserDto,
  SearchUserQueryDto,
  CompanyUserDto,
} from "@dto/user";

// 為 CompanyUserDto 添加額外屬性
export interface ExtendedCompanyUserDto extends CompanyUserDto {
  source?: "client" | "leader" | "unknown";
  isCurrentUser: boolean; // 是否為當前登錄用戶
}

// 重新導出類型以保持向後兼容性
export type User = UserDto;
export type UserProfile = UserProfileDto;
export type UserSalary = UserSalaryDto;
export type SearchedUser = SearchedUserDto;
export type SearchUserQuery = SearchUserQueryDto;

export default class UserService {
  public static readonly keys = {
    users: "user",
    usersByCompany: "users-by-company",
    companyUsers: "company-users",
    companyUsersByCompany: "company-users-by-company",
    userProfile: "user-profile",
    userSalaries: "user-salaries",
    searchedUsers: "searched-users",
  };

  public static readonly getUsers = async (): Promise<UserDto[]> => {
    const result = await axios.get(`${API_URL}/users`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });

    if (result.status !== 200) {
      toast("GET users failed", { type: "error" });
      return [];
    }

    return result.data;
  };

  public static readonly getCompanyUsers = async (): Promise<UserDto[]> => {
    const result = await axios.get(`${API_URL}/users/by-company`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });

    if (result.status !== 200) {
      toast("GET users failed", { type: "error" });
      return [];
    }

    return result.data;
  };

  public static readonly getAllCompanyUsers = async (query?: {
    companyId?: number;
    name?: string;
    department?: string;
    isAdmin?: boolean;
    excludeLeftMembers?: boolean;
  }): Promise<any[]> => {
    let url = `${API_URL}/users/company-users`;

    if (query) {
      const params = new URLSearchParams();
      if (query.companyId)
        params.append("companyId", query.companyId.toString());
      if (query.name) params.append("name", query.name);
      if (query.department) params.append("department", query.department);
      if (query.isAdmin !== undefined)
        params.append("isAdmin", query.isAdmin.toString());
      if (query.excludeLeftMembers !== undefined)
        params.append(
          "excludeLeftMembers",
          query.excludeLeftMembers.toString(),
        );

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const result = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });

    if (result.status !== 200) {
      toast("GET company users failed", { type: "error" });
      return [];
    }

    return result.data;
  };

  public static readonly getCompanyUsersByCompanyId = async (
    companyId: number,
  ): Promise<CompanyUserDto[]> => {
    const result = await axios.get(
      `${API_URL}/users/company-users/by-company/${companyId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      },
    );

    if (result.status !== 200) {
      toast("GET company users failed", { type: "error" });
      return [];
    }

    return result.data;
  };

  public static readonly getCompanyUserDetail = async (
    id: number,
  ): Promise<any> => {
    const result = await axios.get(`${API_URL}/users/company-users/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });

    if (result.status !== 200) {
      toast("GET company user detail failed", { type: "error" });
      return null;
    }

    return result.data;
  };

  public static readonly getUserProfile = async (
    id: number,
  ): Promise<UserProfileDto> => {
    const result = await axios(`${API_URL}/users/${id}/profile`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });
    return result.data;
  };

  public static readonly searchUsers = async (
    queryParams?: SearchUserQueryDto,
  ): Promise<SearchedUserDto[]> => {
    let url = `${API_URL}/users/search?`;
    if (queryParams) {
      if (queryParams.name) {
        url += `name=${queryParams.name}`;
      }
      if (queryParams.yearsOfExperience) {
        url += `&yearsOfExperience=${queryParams.yearsOfExperience}`;
      }
      if (queryParams.expertises && queryParams.expertises.length > 0) {
        url += `&expertises=${queryParams.expertises}`;
      }
      if (queryParams.expectedHourlyRates) {
        url += `&expectedHourlyRates=${queryParams.expectedHourlyRates}`;
      }
      if (queryParams.availableWeeklyHours) {
        url += `&availableWeeklyHours=${queryParams.availableWeeklyHours}`;
      }
      if (typeof queryParams.totalHours === "number") {
        url += `&totalHours=${queryParams.totalHours}`;
      }
    }

    const result = await axios(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });
    return result.data;
  };

  public static readonly validateUserByEmail = async (
    email: string,
  ): Promise<{ isValid: boolean; user: UserDto }> => {
    const result = await axios(`${API_URL}/users/by-email?email=${email}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });

    return { isValid: result.status === 200, user: result.data };
  };

  public static readonly getUserSalaries = async (
    id: number,
  ): Promise<UserSalaryDto[]> => {
    const result = await axios(`${API_URL}/users/${id}/salaries`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });
    return result.data;
  };

  /**
   * 獲取與里程碑相關的公司用戶
   * 包括里程碑所屬項目的客戶公司用戶，以及里程碑負責人所屬公司的用戶
   */
  public static readonly getMilestoneRelatedCompanyUser = async (
    milestonePublicId: string,
  ): Promise<ExtendedCompanyUserDto[]> => {
    const result = await axios.get(
      `${API_URL}/users/company-users/by-milestone/${milestonePublicId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      },
    );

    if (result.status !== 200) {
      toast("獲取里程碑相關公司用戶失敗", { type: "error" });
      return [];
    }

    return result.data;
  };
}
