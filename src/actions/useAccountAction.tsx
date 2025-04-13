import { useMutation, useQuery } from "@tanstack/react-query";
import type { Role } from "@shared/utils/types";
import { ACCESS_TOKEN, API_URL } from "@shared/utils/utils";
import { toast } from "react-toastify";
import UserService from "@shared/api/userService";
import type { CompanyUserDto } from "@dto/user";

export type Account = {
  companyId: number | null;
  email: string;
  id: number;
  name: string;
  registrationStatus: "PENDING" | "REJECTED" | "APPROVED";
  role: Role;
};

export type AccountWithCompanyUser = Account & {
  companyUser?: CompanyUserDto;
};

export const useGetAccount = () => {
  const { data, ...props } = useQuery<Account>({
    queryKey: ["account"],
    queryFn: async () => {
      try {
        const result = await window.fetch(`${API_URL}/account`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        });

        if (result.status !== 200) {
          // toast("GET account failed", { type: "error" })
          return undefined;
        }

        const data = await result.json();
        // 如果有公司ID，查詢對應的CompanyUser資訊
        if (data && data.companyId) {
          try {
            // 獲取該公司所有用戶
            const companyUsers = await UserService.getCompanyUsersByCompanyId(
              data.companyId,
            );

            // 在companyUsers中找到當前用戶
            const currentCompanyUser = companyUsers.find(
              (cu) => cu.userId === data.id,
            );

            if (currentCompanyUser) {
              // 添加公司用戶資訊到account
              data.companyUser = currentCompanyUser;
            } else {
              console.warn(`未找到用戶 ${data.id} 的公司資訊`);
            }
          } catch (error) {
            console.error("獲取公司用戶資訊失敗:", error);
            toast("獲取公司用戶資訊失敗，請刷新頁面重試", { type: "error" });
          }
        }

        return data;
      } catch (error) {
        console.error("獲取帳戶資訊失敗:", error);
        toast("獲取帳戶資訊失敗，請刷新頁面重試", { type: "error" });
        return undefined;
      }
    },
  });

  return { account: data, ...props };
};

export const useGetAccountWithCompanyUser = () => {
  const {
    account,
    isLoading: isAccountLoading,
    ...accountProps
  } = useGetAccount();

  const { data: companyUser, isLoading: isCompanyUserLoading } = useQuery<
    CompanyUserDto | undefined
  >({
    queryKey: ["company-user", account?.id, account?.companyId],
    queryFn: async () => {
      if (!account?.companyId || !account?.id) {
        return undefined;
      }

      try {
        // 獲取該公司所有用戶
        const companyUsers = await UserService.getCompanyUsersByCompanyId(
          account.companyId,
        );

        // 在companyUsers中找到當前用戶
        const currentCompanyUser = companyUsers.find(
          (cu) => cu.userId === account.id,
        );

        if (currentCompanyUser) {
          return currentCompanyUser;
        } else {
          console.warn(`未找到用戶 ${account.id} 的公司資訊`);
          return undefined;
        }
      } catch (error) {
        console.error("獲取公司用戶資訊失敗:", error);
        toast("獲取公司用戶資訊失敗，請刷新頁面重試", { type: "error" });
        return undefined;
      }
    },
    enabled: !!account?.companyId && !!account?.id, // 只有當有account和companyId時才執行
  });

  // 組合account和companyUser
  const accountWithCompanyUser: AccountWithCompanyUser | undefined = account
    ? {
        ...account,
        companyUser,
      }
    : undefined;

  return {
    account: accountWithCompanyUser,
    isLoading: isAccountLoading || isCompanyUserLoading,
    ...accountProps,
  };
};

export const useCreateAccount = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (formData: FormData) => {
      const accountResult = await window.fetch(`${API_URL}/account`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      });

      // 200 OK or 201 Created
      if (accountResult.status > 201) {
        const error = await accountResult.json();
        console.error("第一個請求失敗:", error);
        throw error;
      }

      const uploadResult = await window.fetch(
        `${API_URL}/account/complete-registration`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );

      // TODO: 兩個api合併後就不用處理
      if (uploadResult.status !== 200) {
        const error = await uploadResult.json();
        console.error("第二個請求失敗:", error);
        toast(`履歷上傳失敗 [${error.message}]`, { type: "error" });
      }
      const account = (await uploadResult.json()) as Account;

      return account;
    },
    onSuccess: (data) => {
      toast("註冊帳號成功", { type: "success", autoClose: 1000 });
    },
    onError: (error) => {
      console.error("註冊帳號onError回調中的錯誤:", error);
      toast(`註冊帳號失敗 {${error.message}}`, { type: "error" });
    },
  });

  return { createAccount: mutateAsync };
};
