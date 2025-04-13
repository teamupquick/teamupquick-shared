import { useProject } from "./useProjectAction";

export const usePermissionValidator = ({ id }: { id: number | string }) => {

  const { projectDetail } = useProject({ id: id ? id.toString() : "" });

  // 檢查是否可以創建里程碑
  const canCreateMilestone = (userId: number) => {
    if (!projectDetail) return false;

    // 如果是項目的負責人或創建者
    if (
      projectDetail.assignee?.id === userId ||
      projectDetail.creatorId === userId
    ) {
      return true;
    }

    return false;
  };

  // 檢查是否可以編輯項目
  const canEditProject = (userId: number) => {
    if (!projectDetail) return false;

    // 如果是項目的負責人或創建者
    if (
      projectDetail.assignee?.id === userId ||
      projectDetail.creatorId === userId
    ) {
      return true;
    }

    return false;
  };

  // 檢查是否可以編輯里程碑
  const canEditMilestone = (milestoneId: number, userId: number) => {
    if (!projectDetail) return false;

    // 如果是項目的負責人或創建者
    if (
      projectDetail.assignee?.id === userId ||
      projectDetail.creatorId === userId
    ) {
      return true;
    }

    // 如果是里程碑的負責人
    const milestone = projectDetail.milestones?.find(
      (m) => m.id === milestoneId,
    );
    if (milestone && milestone.assignee?.id === userId) {
      return true;
    }

    return false;
  };

  // 檢查是否可以刪除里程碑
  const canDeleteMilestone = (milestoneId: number, userId: number) => {
    return canEditMilestone(milestoneId, userId);
  };

  // 檢查是否可以創建任務
  const canCreateTask = (milestoneId: number, userId: number) => {
    if (!projectDetail) return false;

    // 如果是項目的負責人或創建者
    if (
      projectDetail.assignee?.id === userId ||
      projectDetail.creatorId === userId
    ) {
      return true;
    }

    // 如果是里程碑的負責人
    const milestone = projectDetail.milestones?.find(
      (m) => m.id === milestoneId,
    );
    if (milestone && milestone.assignee?.id === userId) {
      return true;
    }

    return false;
  };

  // 檢查是否可以編輯任務
  const canEditTask = (milestoneId: number, taskId: number, userId: number) => {
    if (!projectDetail) return false;

    // 如果是項目的負責人或創建者
    if (
      projectDetail.assignee?.id === userId ||
      projectDetail.creatorId === userId
    ) {
      return true;
    }

    // 如果是里程碑的負責人
    const milestone = projectDetail.milestones?.find(
      (m) => m.id === milestoneId,
    );
    if (milestone && milestone.assignee?.id === userId) {
      return true;
    }

    // 如果是任務的負責人
    const task = milestone?.tasks?.find((t) => t.id === taskId);
    if (task && task.assignee?.user?.id === userId) {
      return true;
    }

    return false;
  };

  // 檢查是否可以刪除任務
  const canDeleteTask = (
    milestoneId: number,
    taskId: number,
    userId: number,
  ) => {
    return canEditTask(milestoneId, taskId, userId);
  };

  // 檢查是否可以創建子任務
  const canCreateSubTask = (
    milestoneId: number,
    taskId: number,
    userId: number,
  ) => {
    return canEditTask(milestoneId, taskId, userId);
  };

  // 以下為舊版 API 名稱，保持向後兼容
  const canEditSubTask = (
    milestoneId: number,
    taskId: number,
    subtaskId: number,
    userId: number,
  ) => {
    return canEditSubtask(milestoneId, taskId, subtaskId, userId);
  };

  const canDeleteSubTask = (
    milestoneId: number,
    taskId: number,
    subtaskId: number,
    userId: number,
  ) => {
    return canEditSubtask(milestoneId, taskId, subtaskId, userId);
  };

  // 檢查是否可以編輯子任務
  const canEditSubtask = (
    milestoneId: number,
    taskId: number,
    subtaskId: number,
    userId: number,
  ) => {
    if (!projectDetail) return false;

    // 如果是項目的負責人或創建者
    if (
      projectDetail.assignee?.id === userId ||
      projectDetail.creatorId === userId
    ) {
      return true;
    }

    // 如果是里程碑的負責人
    const milestone = projectDetail.milestones?.find(
      (m) => m.id === milestoneId,
    );
    if (milestone && milestone.assignee?.id === userId) {
      return true;
    }

    // 如果是任務的負責人
    const task = milestone?.tasks?.find((t) => t.id === taskId);
    if (task && task.assignee?.user?.id === userId) {
      return true;
    }

    // 如果是子任務的負責人
    const subtask = task?.subTasks?.find(
      (s: { id: number }) => s.id === subtaskId,
    );
    if (subtask && subtask.assignee?.id === userId) {
      return true;
    }

    return false;
  };

  // 檢查是否可以刪除子任務
  const canDeleteSubtask = (
    milestoneId: number,
    taskId: number,
    subtaskId: number,
    userId: number,
  ) => {
    return canEditSubtask(milestoneId, taskId, subtaskId, userId);
  };

  return {
    canCreateMilestone,
    canEditProject,
    canEditMilestone,
    canDeleteMilestone,
    canCreateTask,
    canEditTask,
    canDeleteTask,
    canCreateSubTask,
    canEditSubTask,
    canDeleteSubTask,
    canEditSubtask,
    canDeleteSubtask,
  };
};
