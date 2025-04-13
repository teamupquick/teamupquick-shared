import { useParams } from "react-router-dom";
import { useProject } from "./useProjectAction";
import { useCallback } from "react";
import { Milestone, Project, Subtask, Task } from "@shared/utils/types";

const isProjectOwner = (project: Project, userId: number) =>
  project.creatorId === userId || project.assignee.id === userId;

const isMilestoneOwner = (milestone: Milestone, userId: number) =>
  milestone.creatorId === userId || milestone.assignee.id === userId;

const isMilestoneMember = (milestone: Milestone, userId: number) =>
  milestone.members.find(({ user }) => user.id === userId) !== undefined;

const isTaskOwner = (task: Task, userId: number) =>
  task.creatorId === userId || task.assignee.id === userId;

const isSubTaskOwner = (subTask: Subtask, userId: number) =>
  subTask.creatorId === userId || subTask.assignee.id === userId;

export const usePermissionValidator = ({ id: projectId }: { id: string }) => {
  const { projectDetail } = useProject({ id: projectId.toString() });

  const canEditProject = useCallback(
    (userId: number) => {
      if (!projectDetail) {
        return false;
      }
      return isProjectOwner(projectDetail, userId);
    },
    [projectDetail],
  );

  const canDeleteProject = useCallback(
    (userId: number) => {
      if (!projectDetail) {
        return false;
      }
      return projectDetail.creatorId === userId;
    },
    [projectDetail],
  );

  const canCreateMilestone = useCallback(
    (userId: number) => {
      if (!projectDetail) {
        return false;
      }
      return isProjectOwner(projectDetail, userId);
    },
    [projectDetail],
  );

  const canEditMilestone = useCallback(
    (userId: number) => {
      if (!projectDetail) {
        return false;
      }
      return isProjectOwner(projectDetail, userId);
    },
    [projectDetail],
  );

  const canDeleteMilestone = useCallback(
    (userId: number) => {
      if (!projectDetail) {
        return false;
      }
      return isProjectOwner(projectDetail, userId);
    },
    [projectDetail],
  );

  const canCreateTask = useCallback(
    (milestoneId: number, userId: number) => {
      if (!projectDetail) {
        return false;
      }
      const milestone = projectDetail.milestones.find(
        ({ id }) => id === milestoneId,
      );
      if (!milestone) {
        return false;
      }

      return (
        isProjectOwner(projectDetail, userId) ||
        isMilestoneOwner(milestone, userId) ||
        isMilestoneMember(milestone, userId)
      );
    },
    [projectDetail],
  );

  const canEditTask = useCallback(
    (milestoneId: number, taskId: number, userId: number) => {
      if (!projectDetail) {
        return false;
      }
      const milestone = projectDetail.milestones.find(
        ({ id }) => id === milestoneId,
      );
      if (!milestone) {
        return false;
      }
      const task = milestone.tasks.find(({ id }) => id === taskId);
      if (!task) {
        return false;
      }

      return (
        isProjectOwner(projectDetail, userId) ||
        isMilestoneOwner(milestone, userId) ||
        isTaskOwner(task, userId)
      );
    },
    [projectDetail],
  );

  const canDeleteTask = useCallback(
    (milestoneId: number, taskId: number, userId: number) => {
      if (!projectDetail) {
        return false;
      }
      const milestone = projectDetail.milestones.find(
        ({ id }) => id === milestoneId,
      );
      if (!milestone) {
        return false;
      }
      const task = milestone.tasks.find(({ id }) => id === taskId);
      if (!task) {
        return false;
      }

      return (
        isProjectOwner(projectDetail, userId) ||
        isMilestoneOwner(milestone, userId) ||
        task.creatorId === userId
      );
    },
    [projectDetail],
  );

  const canCreateSubTask = useCallback(
    (milestoneId: number, taskId: number, userId: number) => {
      if (!projectDetail) {
        return false;
      }
      const milestone = projectDetail.milestones.find(
        ({ id }) => id === milestoneId,
      );
      if (!milestone) {
        return false;
      }
      const task = milestone.tasks.find(({ id }) => id === taskId);
      if (!task) {
        return false;
      }

      return (
        isProjectOwner(projectDetail, userId) ||
        isMilestoneOwner(milestone, userId) ||
        isMilestoneMember(milestone, userId) ||
        isTaskOwner(task, userId)
      );
    },
    [projectDetail],
  );

  const canEditSubTask = useCallback(
    (
      milestoneId: number,
      taskId: number,
      subTaskId: number,
      userId: number,
    ) => {
      if (!projectDetail) {
        return false;
      }
      const milestone = projectDetail.milestones.find(
        ({ id }) => id === milestoneId,
      );
      if (!milestone) {
        return false;
      }
      const task = milestone.tasks.find(({ id }) => id === taskId);
      if (!task) {
        return false;
      }
      const subTask = task.subTasks.find(({ id }) => id === subTaskId);
      if (!subTask) {
        return false;
      }

      return (
        isProjectOwner(projectDetail, userId) ||
        isMilestoneOwner(milestone, userId) ||
        isTaskOwner(task, userId) ||
        isSubTaskOwner(subTask, userId)
      );
    },
    [projectDetail],
  );

  const canDeleteSubTask = useCallback(
    (
      milestoneId: number,
      taskId: number,
      subTaskId: number,
      userId: number,
    ) => {
      if (!projectDetail) {
        return false;
      }
      const milestone = projectDetail.milestones.find(
        ({ id }) => id === milestoneId,
      );
      if (!milestone) {
        return false;
      }
      const task = milestone.tasks.find(({ id }) => id === taskId);
      if (!task) {
        return false;
      }
      const subTask = task.subTasks.find(({ id }) => id === subTaskId);
      if (!subTask) {
        return false;
      }

      return (
        isProjectOwner(projectDetail, userId) ||
        isMilestoneOwner(milestone, userId) ||
        isTaskOwner(task, userId) ||
        subTask.creatorId === userId
      );
    },
    [projectDetail],
  );

  return {
    canEditProject,
    canDeleteProject,
    canCreateMilestone,
    canEditMilestone,
    canDeleteMilestone,
    canCreateTask,
    canEditTask,
    canDeleteTask,
    canCreateSubTask,
    canEditSubTask,
    canDeleteSubTask,
  };
};
