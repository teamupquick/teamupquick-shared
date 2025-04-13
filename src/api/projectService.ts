import type { Project } from "@dto/project/response";
import type { Milestone } from "@dto/milestone/response";
import { ACCESS_TOKEN, API_URL, LOCAL_STORAGE_KEYS } from "@shared/utils/utils";
import axios from "axios";
import { toast } from "react-toastify";
import type { ProjectRequest } from "@dto/project/request";
import type { MilestoneRequest } from "@dto/milestone/request";
import type {
  ProjectListItemDto,
  DeletionResponseDto,
} from "@dto/project/response";
import type { MilestoneDetailsResponseDto } from "@dto/milestone/response";

// 重新導出類型以保持向後兼容性 - 從現有導入中導出
export type SearchedProject = Project;
export type SearchProjectQuery = {
  name?: string;
  assigneeId?: number;
  status?: string;
  priority?: string;
  startDate?: Date;
  endDate?: Date;
};
export type ProjectDetail = Project;
export enum MilestoneStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
export type ProjectMember = {
  id: number;
  name: string;
  role: string;
  hourlyRate: number;
};
export type ProjectMilestone = Milestone;

// 導出預算響應類型
export type ProjectBudgetResponse = {
  projectBudget: number;
  usedBudget: number;
  availableBudget: number;
};

// 導出請求類型別名
export type MilestoneReq = MilestoneRequest;
export type { ProjectRequest };
export type { ProjectListItemDto, DeletionResponseDto };

export default class ProjectService {
  public static readonly keys = {
    projects: "projects",
    projectDetail: "project-detail",
    milestoneDetail: "milestone-detail",
    milestoneLeaderInvitations: "milestone-leader-invitations",
    milestoneMemberInvitations: "milestone-member-invitations",
  };

  public static readonly getProjects = async (): Promise<
    ProjectListItemDto[]
  > => {
    const accessToken = window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.accessToken,
    );
    const result = await axios.get(`${API_URL}/projects`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (result.status !== 200) {
      toast("GET projects failed", { type: "error" });
      return [];
    }

    return result.data;
  };

  public static readonly getProjectDetail = async (
    publicId: string,
  ): Promise<Project | null> => {
    const accessToken = window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.accessToken,
    );

    try {
      const result = await axios.get(`${API_URL}/projects/${publicId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (result.status !== 200) {
        console.error(
          `獲取項目詳情失敗，狀態碼: ${result.status}，URL: ${API_URL}/projects/${publicId}`,
        );
        return null;
      }
      return result.data;
    } catch (error: unknown) {
      console.error(
        `獲取項目詳情時發生錯誤，publicId: ${publicId}，URL: ${API_URL}/projects/${publicId}，錯誤:`,
        error,
      );
      return null;
    }
  };

  public static readonly addProject = async (
    projectRequest: ProjectRequest,
  ): Promise<Project> => {
    const accessToken = window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.accessToken,
    );

    const result = await axios(`${API_URL}/projects`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        ...projectRequest,
      },
    });

    return result.data;
  };

  public static readonly addProjectSampleData = async (
    projectId: number | string,
  ): Promise<Project> => {
    const accessToken = window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.accessToken,
    );
    const result = await axios(`${API_URL}/projects/${projectId}/sampleData`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return result.data;
  };

  public static readonly editProject = async ({
    id,
    projectRequest,
  }: {
    id: number;
    projectRequest: ProjectRequest;
  }): Promise<Project> => {
    const result = await axios(`${API_URL}/projects/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
      data: {
        ...projectRequest,
      },
    });

    return result.data;
  };

  public static readonly deleteProject = async (
    publicId: string,
  ): Promise<DeletionResponseDto> => {
    const result = await axios(`${API_URL}/projects/${publicId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });

    return result.data;
  };

  public static readonly getMilestoneDetail = async (
    id: number,
    projectPublicId?: string,
  ): Promise<MilestoneDetailsResponseDto> => {
    let apiUrl;

    if (projectPublicId) {
      apiUrl = `${API_URL}/projects/${projectPublicId}/milestones/${id}`;
    } else {
      try {
        apiUrl = `${API_URL}/milestones/by-id/${id}`;
      } catch {
        console.error("獲取里程碑詳情需要項目publicId");
        throw new Error("缺少項目ID，無法獲取里程碑詳情");
      }
    }

    const result = await axios(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });
    return result.data;
  };

  public static readonly getMilestoneByPublicId = async (
    publicId: string,
    projectPublicId: string,
  ): Promise<MilestoneDetailsResponseDto> => {
    const result = await axios(
      `${API_URL}/projects/${projectPublicId}/milestones/by-public-id/${publicId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      },
    );

    return result.data;
  };

  public static readonly addMilestone = async ({
    projectId,
    milestoneReq,
  }: {
    projectId: string;
    milestoneReq: MilestoneRequest;
  }) => {
    if (!projectId) {
      console.error("必須提供項目ID才能創建里程碑");
      throw new Error("缺少項目ID，無法創建里程碑");
    }

    const apiUrl = `${API_URL}/projects/${projectId}/milestones`;

    const result = await axios(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
      data: {
        ...milestoneReq,
      },
    });

    return result.data;
  };

  public static readonly editMilestone = async ({
    id,
    milestoneReq,
  }: {
    id: number;
    milestoneReq: MilestoneRequest;
  }): Promise<Milestone> => {
    // 添加日誌，記錄里程碑更新請求

    // 由於里程碑端點結構更改，我們需要確定項目ID
    let apiUrl;
    // 嘗試從請求體中的屬性獲取或使用基本路徑
    // @ts-ignore 忽略類型檢查，因為我們在運行時檢查屬性是否存在
    if (milestoneReq.projectPublicId) {
      apiUrl = `${API_URL}/projects/${milestoneReq.projectPublicId}/milestones/${id}`;
    } else {
      // 舊的API端點不再可用，需要獲取項目ID
      console.error("必須提供項目ID才能更新里程碑");
      throw new Error("缺少項目ID，無法更新里程碑");
    }

    try {
      const result = await axios(apiUrl, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
        data: {
          ...milestoneReq,
        },
      });

      return result.data;
    } catch (error: any) {
      console.error(
        "【里程碑更新】更新失敗:",
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  public static readonly deleteMilestone = async (
    id: number,
  ): Promise<DeletionResponseDto> => {
    const result = await axios(`${API_URL}/milestones/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    });

    return result.data;
  };

  public static readonly searchProjects = async (
    searchQuery: SearchProjectQuery,
  ): Promise<SearchedProject[]> => {
    const result = await axios(`${API_URL}/projects/search`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
      data: searchQuery,
    });

    return result.data;
  };

  public static readonly updateMilestoneLeader = async ({
    milestoneId,
    invitationId,
    leaderId,
    leaderRate,
  }: {
    milestoneId: number;
    invitationId: number;
    leaderId: number;
    leaderRate: number;
  }) => {
    const result = await axios.put(
      `${API_URL}/leader-invitations/${milestoneId}/${invitationId}/approve`,
      {
        leaderId,
        leaderRate,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      },
    );

    return result.data;
  };

  public static readonly updateMilestoneMember = async ({
    milestoneId,
    invitationId,
    hourlyRate,
    role,
  }: {
    milestoneId: number;
    invitationId: number;
    hourlyRate: number;
    role: string;
  }) => {
    const result = await axios.put(
      `${API_URL}/milestones/${milestoneId}/member-invitations/${invitationId}`,
      {
        hourlyRate,
        role,
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      },
    );

    return result.data;
  };

  public static readonly getProjectAvailableBudget = async (
    publicId: string,
  ): Promise<ProjectBudgetResponse> => {
    try {
      const result = await axios.get(
        `${API_URL}/projects/${publicId}/available-budget`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN()}`,
          },
        },
      );

      return result.data;
    } catch (error) {
      console.error(
        `獲取專案可用預算失敗，publicId: ${publicId}，錯誤:`,
        error,
      );
      throw error;
    }
  };
}
