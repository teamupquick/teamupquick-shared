import ServiceCompanyService from "@shared/api/serviceCompanyService";
import type {
  SearchServiceCompanyQueryDto} from "@dto/serviceCompany";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useServiceCompaniesAction = () => {
  const { data } = useQuery({
    queryKey: [ServiceCompanyService.keys.serviceCompanies],
    queryFn: () => ServiceCompanyService.getServiceCompanies(),
  });

  return { serviceCompanies: data ?? [] };
};

export const useSearchServiceCompaniesAction = () => {
  const [queryParams, setQueryParams] = useState<
    SearchServiceCompanyQueryDto | undefined
  >(undefined);

  const { data } = useQuery({
    queryKey: [
      ServiceCompanyService.keys.searchedServiceCompanies,
      queryParams,
    ],
    queryFn: () => ServiceCompanyService.searchServiceCompanies(queryParams),
  });

  const searchServiceCompanies = async (
    searchQuery?: SearchServiceCompanyQueryDto,
  ) => {
    setQueryParams(searchQuery);
  };

  return { searchedServiceCompanies: data ?? [], searchServiceCompanies };
};
