import ProjectService from "@shared/api/projectService";
import TaskService from "@shared/api/taskService";
import MilestoneService from "@shared/api/milestoneService";
import SubtaskService from "@shared/api/subtaskService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@shared/utils/routes";
import { toastApiErrors } from "@shared/utils/utils";
import type { AxiosError } from "axios";
import { generatePath, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InvitationService from "@shared/api/invitationService";

/**
 * 優化版 ProjectAction Hooks
 *
 * 主要改進：
 * 1. 使用 React Query 的 invalidateQueries 來確保數據更新後UI自動刷新
 * 2. 添加更多優化的刷新邏輯，確保相關列表自動更新
 * 3. 調整了數據過期時間，確保使用最新數據
 */

function useGetProject(publicId: string) {
  // 檢查publicId是否為純數字
  const isNumeric = /^\d+$/.test(publicId);
  if (isNumeric && publicId !== "new") {
    console.warn(
      "警告: 使用純數字ID調用API，應該使用publicId（UUID格式）而不是數字ID。當前值:",
      publicId,
    );
  }

  const resp = useQuery({
    queryKey: [ProjectService.keys.projectDetail, publicId],
    queryFn: async () => {
      try {
        // 如果是新建專案或 publicId 是路徑參數占位符，返回 null
        if (publicId === "new" || publicId === ":id") {
          return null;
        }

        const data = await ProjectService.getProjectDetail(publicId);
        return data;
      } catch (error: unknown) {
        console.error(`查詢項目出錯，publicId: ${publicId}，錯誤:`, error);
        // 如果是新建項目路徑，返回空項目對象
        if (publicId === "new" || publicId === ":id") {
          return null;
        }
        throw error;
      }
    },
    enabled: !!publicId && publicId !== ":id", // 只有當 publicId 存在且不是路徑參數占位符時才啟用查詢
    staleTime: 0, // 將過期時間設為0，確保每次都重新獲取數據
    retry: (failureCount, error) => {
      // 當publicId為"new"時不重試
      if (publicId === "new" || publicId === ":id") return false;
      return failureCount < 3;
    },
  });

  return resp;
}

function useGetProjects() {
  const resp = useQuery({
    queryKey: [ProjectService.keys.projects],
    queryFn: ProjectService.getProjects,
  });

  return resp;
}

type ProjectProps = {
  id: string;
};
export const useProject = ({ id }: ProjectProps) => {
  const {
    data: projectDetail,
    isLoading,
    isError,
    isFetched,
    refetch,
  } = useGetProject(id);

  return { projectDetail, isLoading, isFetched, isError, refetch };
};

export const useProjects = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: projects, isLoading, isError } = useGetProjects();
  const addProjectMutation = useMutation({
    mutationFn: ProjectService.addProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projects],
      });
      // 使用 id 字段作為跳轉 URL 的參數
      // API 返回的類型可能包含 publicId 字段，但類型定義中沒有
      // @ts-ignore - 服務器返回的數據可能包含 publicId
      const publicId = data.publicId || data.id.toString();

      // 檢查 publicId 是否為有效值
      if (!publicId) {
        console.error("錯誤: publicId 為空值");
      }
      navigate(generatePath(ROUTES.project, { id: publicId }));
    },
    onError: (error: AxiosError) => {
      console.error("新增專案失敗，錯誤:", error);
      toastApiErrors(error);
    },
  });

  const editProjectMutation = useMutation({
    mutationFn: ProjectService.editProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projects],
      });
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projectDetail, data.id],
      });
      // 使用 id 字段作為跳轉 URL 的參數
      // API 返回的類型可能包含 publicId 字段，但類型定義中沒有
      // @ts-ignore - 服務器返回的數據可能包含 publicId
      const publicId = data.publicId || data.id.toString();
      navigate(generatePath(ROUTES.project, { id: publicId }));
    },
    onError: (error: AxiosError) => {
      toastApiErrors(error);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: ProjectService.deleteProject,
    onSuccess: () => {
      toast("刪除專案成功", { type: "success", autoClose: 1000 });
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projects],
      });
      navigate(ROUTES.home);
    },
    onError: (error: AxiosError) => {
      toastApiErrors(error);
    },
  });

  return {
    projects,
    isLoading,
    isError,
    addProject: addProjectMutation.mutate,
    editProject: editProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
  };
};

export const useMilestone = (id: number) => {
  const { data: milestoneDetail } = useQuery({
    queryKey: [ProjectService.keys.milestoneDetail, id],
    queryFn: () => ProjectService.getMilestoneDetail(id),
    staleTime: 0, // 確保數據總是最新的
  });

  return { milestoneDetail };
};

type MilestonesProps = {
  projectId: number;
  publicId?: string; // 添加 publicId 參數，設為可選
};

export const useMilestones = ({ projectId, publicId }: MilestonesProps) => {
  const queryClient = useQueryClient();
  const { refetch: refetchProject } = useGetProject(
    publicId || projectId.toString(),
  );

  const addMilestoneMutation = useMutation({
    mutationFn: ProjectService.addMilestone,
    onSuccess: (data) => {
      toast("新增里程碑成功", { type: "success", autoClose: 1000 });
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projectDetail, publicId || projectId],
      });
      refetchProject();
    },
    onError: (error: AxiosError) => {
      toastApiErrors(error);
    },
  });

  const editMilestoneMutation = useMutation({
    mutationFn: ProjectService.editMilestone,
    onSuccess: (data) => {
      toast("編輯里程碑成功", { type: "success", autoClose: 1000 });
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projectDetail, publicId || projectId],
      });
      if (data && data.id) {
        queryClient.invalidateQueries({
          queryKey: [ProjectService.keys.milestoneDetail, data.id],
        });
      }
      refetchProject();
    },
    onError: (error: AxiosError) => {
      toastApiErrors(error);
    },
  });

  const deleteMilestoneMutation = useMutation({
    mutationFn: ProjectService.deleteMilestone,
    onSuccess: (_data) => {
      toast("刪除里程碑成功", { type: "success", autoClose: 1000 });
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projectDetail, publicId || projectId],
      });
      refetchProject();
    },
    onError: (error: AxiosError) => {
      toastApiErrors(error);
    },
  });

  return {
    addMilestone: addMilestoneMutation.mutate,
    editMilestone: editMilestoneMutation.mutate,
    deleteMilestone: deleteMilestoneMutation.mutate,
  };
};

export const useMilestoneLeaderInvitations = ({
  id,
  enabled,
}: {
  id: number;
  enabled?: boolean;
}) => {
  const { data: milestoneLeaderInvitations } = useQuery({
    queryKey: [ProjectService.keys.milestoneLeaderInvitations, id],
    queryFn: () => InvitationService.getMilestoneLeaderInvitations(id),
    enabled: enabled !== false,
    staleTime: 0, // 確保數據總是最新的
  });

  return { milestoneLeaderInvitations };
};

export const useMilestoneMemberInvitations = ({
  id,
  enabled,
}: {
  id: number;
  enabled?: boolean;
}) => {
  const { data: milestoneMemberInvitations } = useQuery({
    queryKey: [ProjectService.keys.milestoneMemberInvitations, id],
    queryFn: () => InvitationService.getMilestoneMemberInvitations(id),
    enabled: enabled !== false,
    staleTime: 0, // 確保數據總是最新的
  });

  return { milestoneMemberInvitations };
};

export const useTask = (id: number) => {
  const { data: taskDetail } = useQuery({
    queryKey: [TaskService.keys.task, id],
    queryFn: () => TaskService.getTask(id),
    staleTime: 0, // 確保數據總是最新的
  });

  return { taskDetail };
};

export const useTasks = (projectPublicId: string) => {
  const queryClient = useQueryClient();
  const { refetch: refetchProject } = useGetProject(projectPublicId);

  const addTaskMutation = useMutation({
    mutationFn: ({
      milestoneId,
      taskReq,
    }: {
      milestoneId: number;
      taskReq: any;
    }) => TaskService.createTask(milestoneId, taskReq),
    onSuccess: (data) => {
      if (!data) return;

      toast("新增任務成功", { type: "success", autoClose: 1000 });
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projectDetail, projectPublicId],
      });
      refetchProject();
    },
    onError: (error: AxiosError) => {
      toastApiErrors(error);
    },
  });

  const editTaskMutation = useMutation({
    mutationFn: ({ id, taskReq }: { id: number; taskReq: any }) =>
      TaskService.updateTask(id, taskReq),
    onSuccess: (data) => {
      if (!data) return;

      toast("編輯任務成功", { type: "success", autoClose: 1000 });
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projectDetail, projectPublicId],
      });
      queryClient.invalidateQueries({
        queryKey: [TaskService.keys.task, data.id],
      });
      refetchProject();
    },
    onError: (error: AxiosError) => {
      toastApiErrors(error);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: TaskService.deleteTask,
    onSuccess: () => {
      toast("刪除任務成功", { type: "success", autoClose: 1000 });
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projectDetail, projectPublicId],
      });
      refetchProject();
    },
    onError: (error: AxiosError) => {
      toastApiErrors(error);
    },
  });

  return {
    addTask: addTaskMutation.mutate,
    editTask: editTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
  };
};

export const useSubtasks = (projectPublicId: string) => {
  const queryClient = useQueryClient();
  const { refetch: refetchProject } = useGetProject(projectPublicId);

  const addSubtaskMutation = useMutation({
    mutationFn: ({
      taskId,
      milestoneId,
      subtaskReq,
    }: {
      taskId: number;
      milestoneId: number;
      subtaskReq: any;
    }) => SubtaskService.addSubtask(milestoneId, taskId, subtaskReq),
    onSuccess: (data) => {
      if (!data) return;

      toast("新增子任務成功", { type: "success", autoClose: 1000 });
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projectDetail, projectPublicId],
      });
      refetchProject();
    },
    onError: (error: AxiosError) => {
      toastApiErrors(error);
    },
  });

  const editSubtaskMutation = useMutation({
    mutationFn: ({ id, subtaskReq }: { id: number; subtaskReq: any }) => {
      return SubtaskService.updateSubtask(id, subtaskReq);
    },
    onSuccess: (data) => {
      if (!data) return;

      toast("編輯子任務成功", { type: "success", autoClose: 1000 });
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projectDetail, projectPublicId],
      });
      queryClient.invalidateQueries({
        queryKey: [SubtaskService.keys.subtask, data.id],
      });
      refetchProject();
    },
    onError: (error: AxiosError) => {
      toastApiErrors(error);
    },
  });

  const deleteSubtaskMutation = useMutation({
    mutationFn: SubtaskService.deleteSubtask,
    onSuccess: () => {
      toast("刪除子任務成功", { type: "success", autoClose: 1000 });
      queryClient.invalidateQueries({
        queryKey: [ProjectService.keys.projectDetail, projectPublicId],
      });
      refetchProject();
    },
    onError: (error: AxiosError) => {
      toastApiErrors(error);
    },
  });

  return {
    addSubtask: addSubtaskMutation.mutate,
    editSubtask: editSubtaskMutation.mutate,
    deleteSubtask: deleteSubtaskMutation.mutate,
  };
};

export const useSubtask = (id: number) => {
  const { data: subtaskDetail } = useQuery({
    queryKey: [SubtaskService.keys.subtask, id],
    queryFn: () => SubtaskService.getSubtask(id),
    staleTime: 0, // 確保數據總是最新的
  });

  return { subtaskDetail };
};
