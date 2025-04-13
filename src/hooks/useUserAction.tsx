import type {
  SearchUserQuery,
  UserSalary,
  ExtendedCompanyUserDto,
} from "@shared/api/userService";
import type { CompanyUserDto } from "@dto/user";
import UserService from "@shared/api/userService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import React from "react";

export const useUsersAction = () => {
  const { data } = useQuery({
    queryKey: [UserService.keys.users],
    queryFn: () => UserService.getUsers(),
  });

  return { users: data ?? [] };
};

export const useSearchUsersAction = () => {
  const [queryParams, setQueryParams] = useState<SearchUserQuery | undefined>(
    undefined,
  );

  const { data } = useQuery({
    queryKey: [UserService.keys.searchedUsers, queryParams],
    queryFn: () => UserService.searchUsers(queryParams),
  });

  const searchUsers = async (searchQuery?: SearchUserQuery) => {
    setQueryParams(searchQuery);
  };

  return { searchedUsers: data ?? [], searchUsers };
};

export const useUsersByCompanyAction = () => {
  const { data } = useQuery({
    queryKey: [UserService.keys.usersByCompany],
    queryFn: () => UserService.getCompanyUsers(),
  });

  return { users: data ?? [] };
};

export const useCompanyUsersAction = (query?: {
  companyId?: number;
  name?: string;
  department?: string;
  isAdmin?: boolean;
  excludeLeftMembers?: boolean;
}) => {
  const { data } = useQuery({
    queryKey: [UserService.keys.companyUsers, query],
    queryFn: () => UserService.getAllCompanyUsers(query),
  });

  return { companyUsers: data ?? [] };
};

export const useCompanyUsersByCompanyAction = (
  companyId: number,
  options?: { enabled?: boolean },
) => {
  const { data } = useQuery({
    queryKey: [UserService.keys.companyUsersByCompany, companyId],
    queryFn: () => UserService.getCompanyUsersByCompanyId(companyId),
    enabled: options?.enabled !== undefined ? options.enabled : !!companyId,
  });

  return { companyUsers: (data ?? []) as CompanyUserDto[] };
};

export const useCompanyUserDetailAction = (id: number) => {
  const { data } = useQuery({
    queryKey: [UserService.keys.companyUsers, id],
    queryFn: () => UserService.getCompanyUserDetail(id),
    enabled: !!id,
  });

  return { companyUser: data };
};

export const useUserAction = () => {
  const validateUserByEmailMutation = useMutation({
    mutationFn: UserService.validateUserByEmail,
    onSuccess: (_data) => {
      toast("驗證成功", { type: "success", autoClose: 1000 });
    },
    onError: (error) => {
      toast("無符合成員 ", { type: "error" });
      console.error(error);
    },
  });

  return validateUserByEmailMutation;
};

export const useUserProfileAction = (id: number) => {
  const { data } = useQuery({
    queryKey: [UserService.keys.userProfile, id],
    queryFn: () => UserService.getUserProfile(id),
  });

  return { userProfile: data };
};

export const useUserSalariesAction = (
  id: number,
): { userSalaries: UserSalary[] } => {
  const { data } = useQuery({
    queryKey: [UserService.keys.userSalaries, id],
    queryFn: () => UserService.getUserSalaries(id),
  });

  return { userSalaries: data ?? [] };
};

/**
 * 獲取與里程碑相關的公司用戶 Hook
 * 根據里程碑公開ID獲取相關的公司用戶，僅返回當前用戶所屬公司的用戶列表
 */
export const useMilestoneRelatedCompanyUser = (
  milestonePublicId: string,
  options?: { enabled?: boolean },
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["milestone-related-company-users", milestonePublicId],
    queryFn: () =>
      UserService.getMilestoneRelatedCompanyUser(milestonePublicId),
    enabled:
      options?.enabled !== undefined ? options.enabled : !!milestonePublicId,
  });

  // 分類用戶
  const clientUsers = React.useMemo(
    () => (data || []).filter((user) => user.source === "client"),
    [data],
  );

  const leaderUsers = React.useMemo(
    () => (data || []).filter((user) => user.source === "leader"),
    [data],
  );

  const currentUser = React.useMemo(
    () => (data || []).find((user) => user.isCurrentUser),
    [data],
  );

  return {
    companyUsers: (data ?? []) as ExtendedCompanyUserDto[],
    clientUsers: clientUsers as ExtendedCompanyUserDto[],
    leaderUsers: leaderUsers as ExtendedCompanyUserDto[],
    currentUser: currentUser as ExtendedCompanyUserDto | undefined,
    isLoading,
    error,
  };
};
