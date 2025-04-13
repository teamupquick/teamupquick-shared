import { ACCESS_TOKEN, API_URL } from "@shared/utils/utils";
import axios from "axios";
import type {
  FreelancerWorkingTypeEnum,
  FreelancerDto,
  FreelancerProfileDto,
  FreelancerSalaryDto,
  SearchedFreelancerDto,
  SearchFreelancerQueryDto,
} from "@dto/freelancer";

// 重新導出類型以保持向後兼容性
export type Freelancer = FreelancerDto;
export type FreelancerProfile = FreelancerProfileDto;
export type FreelancerSalary = FreelancerSalaryDto;
export type SearchedFreelancer = SearchedFreelancerDto;
export type SearchFreelancerQuery = SearchFreelancerQueryDto;
export { FreelancerWorkingTypeEnum };

export default class FreelancerService {
  public static readonly keys = {
    freelancers: "freelancers",
    freelancerProfile: "freelancer-profile",
    freelancerSalaries: "freelancer-salaries",
    searchedFreelancers: "searched-freelancers",
    isFavorite: "is-favorite",
  };

  public static readonly searchFreelancers = async (
    queryParams?: SearchFreelancerQueryDto,
  ): Promise<SearchedFreelancerDto[]> => {
    try {
      let url = `${API_URL}/freelancers/search?`;
      if (queryParams) {
        const params = new URLSearchParams();
        if (queryParams.searchTerm) {
          params.append("searchTerm", queryParams.searchTerm);
        }
        if (queryParams.workingType) {
          params.append("workingType", queryParams.workingType);
        }
        if (queryParams.weeklyAvailableHours) {
          params.append(
            "weeklyAvailableHours",
            queryParams.weeklyAvailableHours.toString(),
          );
        }
        if (queryParams.location) {
          params.append("location", queryParams.location);
        }
        if (queryParams.availableForWork) {
          params.append("availableForWork", queryParams.availableForWork);
        }
        url += params.toString();
      }

      const result = await axios(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });
      return result.data;
    } catch (error) {
      console.error("搜尋自由工作者時發生錯誤:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "搜尋自由工作者時發生錯誤",
        );
      }
      throw error;
    }
  };

  public static readonly getFreelancerProfile = async (
    id: number,
  ): Promise<FreelancerProfileDto> => {
    const result = await axios(`${API_URL}/freelancers/${id}/profile`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });
    return result.data;
  };

  public static readonly getFreelancerSalaries = async (
    id: number,
  ): Promise<FreelancerSalaryDto[]> => {
    const result = await axios(`${API_URL}/freelancers/${id}/salaries`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });
    return result.data;
  };

  public static readonly isFavorite = async (id: number): Promise<boolean> => {
    try {
      const result = await axios(
        `${API_URL}/api/v1/freelancers/${id}/favorites`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );
      return result.data.isFavorite;
    } catch (error) {
      console.warn("獲取收藏狀態失敗:", error);
      return false;
    }
  };

  public static readonly toggleFavorite = async (id: number): Promise<void> => {
    try {
      await axios(`${API_URL}/api/v1/freelancers/${id}/favorites`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });
    } catch (error) {
      console.error("切換收藏狀態失敗:", error);
      throw error;
    }
  };
}
