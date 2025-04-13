import { ACCESS_TOKEN, API_URL } from "@shared/utils/utils";
import axios from "axios";
import { toast } from "react-toastify";
import type {
  PreferredWorkStyleType,
  PreferredProjectDurationType,
} from "@dto/serviceCompany/common";
import type {
  SearchServiceCompanyQueryDto,
  SearchedServiceCompanyDto,
  CompanySkillDto,
} from "@dto/serviceCompany";

// 重新導出類型以保持向後兼容性
export type SearchServiceCompanyQuery = SearchServiceCompanyQueryDto;
export type SearchedServiceCompany = SearchedServiceCompanyDto;
export type ServiceCompanySkill = CompanySkillDto;
export { PreferredWorkStyleType, PreferredProjectDurationType };

export default class ServiceCompanyService {
  public static readonly keys = {
    serviceCompanies: "service-companies",
    searchedServiceCompanies: "searched-service-companies",
    serviceCompanyProfile: "service-company-profile",
  };

  public static readonly getServiceCompanies = async (): Promise<
    SearchedServiceCompanyDto[]
  > => {
    const result = await axios.get(`${API_URL}/service-companies`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });

    if (result.status !== 200) {
      toast("GET service companies failed", { type: "error" });
      return [];
    }

    return result.data;
  };

  public static readonly getServiceCompanyProfile = async (
    id: number,
  ): Promise<SearchedServiceCompanyDto> => {
    const result = await axios.get(
      `${API_URL}/service-companies/${id}/profile`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      },
    );

    if (result.status !== 200) {
      toast("GET service company profile failed", { type: "error" });
      throw new Error("Failed to get service company profile");
    }
    return result.data;
  };

  public static readonly searchServiceCompanies = async (
    queryParams?: SearchServiceCompanyQueryDto,
  ): Promise<SearchedServiceCompanyDto[]> => {
    let url = `${API_URL}/service-companies/search?`;
    if (queryParams) {
      if (queryParams.name) {
        url += `name=${queryParams.name}`;
      }
      if (queryParams.experiences) {
        url += `&experiences=${queryParams.experiences}`;
      }
      if (typeof queryParams.priceRate === "number") {
        url += `&priceRate=${queryParams.priceRate}`;
      }
      if (typeof queryParams.weeklyAvailableHours === "number") {
        url += `&weeklyAvailableHours=${queryParams.weeklyAvailableHours}`;
      }
      if (typeof queryParams.availableForWork === "boolean") {
        url += `&availableForWork=${queryParams.availableForWork}`;
      }
      if (queryParams.skills) {
        url += `&skills=${encodeURIComponent(queryParams.skills)}`;
      }
      if (queryParams.location) {
        url += `&location=${encodeURIComponent(queryParams.location)}`;
      }
      if (queryParams.preferredWorkStyle) {
        url += `&preferredWorkStyle=${queryParams.preferredWorkStyle}`;
      }
      if (queryParams.preferredProjectDuration) {
        url += `&preferredProjectDuration=${queryParams.preferredProjectDuration}`;
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
}
