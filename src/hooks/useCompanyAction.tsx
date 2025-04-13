import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CompanyResponseDto,
  CompanyWithUsersResponseDto,
  CreateCompanyDto,
  UpdateCompanyDto,
} from "@dto/company";
import CompanyService from "@shared/api/companyService";

/**
 * 獲取所有公司的 hook
 */
export const useCompaniesAction = () => {
  const { data } = useQuery({
    queryKey: [CompanyService.keys.companies],
    queryFn: () => CompanyService.getCompanies(),
  });

  return {
    companies: data || [],
  };
};

/**
 * 獲取單一公司的 hook
 */
export const useCompanyAction = (id: number) => {
  const { data } = useQuery({
    queryKey: [CompanyService.keys.company, id],
    queryFn: () => CompanyService.getCompany(id),
    enabled: !!id,
  });

  return {
    company: data,
  };
};

/**
 * 獲取公司及其使用者的 hook
 */
export const useCompanyWithUsersAction = (id: number) => {
  const { data } = useQuery({
    queryKey: [CompanyService.keys.companyWithUsers, id],
    queryFn: () => CompanyService.getCompanyWithUsers(id),
    enabled: !!id,
  });

  return {
    companyWithUsers: data,
  };
};

/**
 * 創建公司的 hook
 */
export const useCreateCompanyAction = () => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (createCompanyDto: CreateCompanyDto) =>
      CompanyService.createCompany(createCompanyDto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CompanyService.keys.companies],
      });
    },
  });

  return {
    createCompany: mutateAsync,
  };
};

/**
 * 更新公司的 hook
 */
export const useUpdateCompanyAction = (id: number) => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (updateCompanyDto: UpdateCompanyDto) =>
      CompanyService.updateCompany(id, updateCompanyDto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CompanyService.keys.companies],
      });
      queryClient.invalidateQueries({
        queryKey: [CompanyService.keys.company, id],
      });
      queryClient.invalidateQueries({
        queryKey: [CompanyService.keys.companyWithUsers, id],
      });
    },
  });

  return {
    updateCompany: mutateAsync,
  };
};

/**
 * 刪除公司的 hook
 */
export const useDeleteCompanyAction = () => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (id: number) => CompanyService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CompanyService.keys.companies],
      });
    },
  });

  return {
    deleteCompany: mutateAsync,
  };
};
