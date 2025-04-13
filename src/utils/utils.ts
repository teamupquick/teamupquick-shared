import type { User, UserSalary } from "@shared/api/userService";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { Role } from "@auth/components/signUp/roleSelector/RoleSelector";
import { theme } from "./theme";
import type { Priority, Status } from "./types";
import type { MilestoneInvitationStatus } from "@dto/invitation/common";
import type { Milestone } from "@dto/milestone/response";
import type { FailedReason } from "@collaboration/components/invitation/components/InvitationPage";

export const HOMEPAGE_URL = "https://www.teamuq.com";
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const LOCAL_STORAGE_KEYS = {
  accessToken: "accessToken",
  favoriteTalentIds: "favoriteTalentIds",
  favoriteLeaderIds: "favoriteLeaderIds",
};

export const MainColors: { [key in Role]: string } = {
  engineer: theme.brand.secondary,
  business: theme.brand.primary,
};

export const PRIORITY_MAPPING: Record<Priority, string> = {
  LOW: "低",
  MEDIUM: "一般",
  HIGH: "高",
  URGENT: "緊急",
};

export const priorityOptions = Object.entries(PRIORITY_MAPPING).map(
  ([key, value]) => ({ label: value, value: key }),
);

export const STATUS_MAPPING: Record<Status, string> = {
  PREPARATION: "準備中",
  WAITING: "待執行",
  IN_PROGRESS: "進行中",
  PENDING: "暫停",
  COMPLETED: "完成",
  CLOSED: "結案",
  CANCELED: "取消",
  PENDING_EXECUTION: "待執行",
  PENDING_CLOSURE: "待結案",
};

export const STATUS_OPTIONS = Object.entries(STATUS_MAPPING).map(
  ([key, value]) => ({ label: value, value: key }),
);

export const MILESTONE_LEADER_STATUS_MAPPING: Record<
  MilestoneInvitationStatus,
  string
> = {
  PENDING_INVITATION: "等待隊長接受邀請中",
  INVITATION_ACCEPTED: "邀請已接受",
  INVITATION_REJECTED: "邀請未被接受，請重新邀請新隊長！",
  INVITATION_EXPIRED: "邀請連結信已過期失效，請重新邀請新隊長！",
  REMOVED: "已退役",
  INVITATION_CANCELED: "邀請已取消",
  INVITATION_APPROVED: "邀請已核准",
};

export const MILESTONE_MEMBER_STATUS_MAPPING: Record<
  MilestoneInvitationStatus,
  string
> = {
  PENDING_INVITATION: "等待成員接受邀請中",
  INVITATION_ACCEPTED: "邀請已接受",
  INVITATION_REJECTED: "邀請未被接受，請重新邀請新成員！",
  INVITATION_EXPIRED: "邀請連結信已過期失效，請重新邀請新成員！",
  REMOVED: "已退役",
  INVITATION_CANCELED: "邀請已取消",
  INVITATION_APPROVED: "邀請已核准",
};

export const MILESTONE_INVITATION_STATUS_MAPPING: Record<
  MilestoneInvitationStatus,
  string
> = {
  PENDING_INVITATION: "等待接受邀請中",
  INVITATION_ACCEPTED: "現任",
  INVITATION_REJECTED: "拒絕：",
  INVITATION_EXPIRED: "邀請連結過期",
  REMOVED: "已退役",
  INVITATION_CANCELED: "邀請已取消",
  INVITATION_APPROVED: "邀請已核准",
};

export function getFormattedMilestones(milestones: Milestone[]) {
  // {milestoneID, milestoneInfo, [milestoneName, taskName1, ..., subtaskName1, ....]}
  const formattedM: Record<number, { milestone: Milestone; names: string }> =
    {};

  if (!milestones?.length) {
    return formattedM;
  }

  milestones.forEach((m) => {
    const names = [m.name];

    if (m.tasks?.length) {
      m.tasks.forEach((t) => {
        names.push(t.name);
        if (t.subTasks?.length) {
          t.subTasks.forEach((s: { name: string }) => names.push(s.name));
        }
      });
    }

    formattedM[m.id] = { milestone: m, names: names.join("/") };
  });

  return formattedM;
}

// TODO: 改成hook
export const ACCESS_TOKEN = () => {
  const token = window.localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);

  return token;
};

export const DEFAULT_DESCRIPTION = "<p></p>";

export function getAssigneeOptions(
  users: (Omit<User, "email"> | { id: number; name: string } | any)[],
  companyId?: number,
) {
  const assignees: { label: string; value: string; userData?: any }[] = [];

  for (const u of users) {
    if (u.user) {
      // 如果是MilestoneMember對象
      assignees.push({
        label: u.user.name,
        value: u.id?.toString() || u.user.id.toString(),
        userData: u,
      });
    } else {
      // 如果是User對象
      assignees.push({
        label: u.name,
        value: u.id.toString(),
        userData: u,
      });
    }
  }
  return assignees;
}

export function getPercentageColor(percentage: number) {
  if (percentage === 0) {
    return { bg: theme.colors.GN50, font: theme.colors.BN300 };
  }
  if (percentage === 100) return { bg: "#E7F4EE", font: "#0D894F" };
  return { bg: theme.error.light, font: theme.colors.RS500 };
}

export function getTextFieldStyle(error?: boolean) {
  return {
    "& .MuiOutlinedInput-root": {
      backgroundColor: error ? theme.colors.RS50 : theme.colors.GN25,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: error ? theme.colors.RS100 : theme.colors.BN50,
      },
      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: error ? theme.colors.RS500 : theme.colors.BN300,
        },
      },
      "&:hover:not(.Mui-focused)": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: error ? theme.colors.RS500 : theme.colors.BN300,
        },
      },
    },
  };
}

export const TIMER_PADDING_LEFT = 20;
export const TIMER_PADDING_RIGHT = 120;
export const TIMER_PADDING_BOTTOM = 110;

export function safeJsonParse(v: any) {
  if (typeof v !== "string") return null;
  return JSON.parse(v);
}

export function toastApiErrors(error: AxiosError) {
  const errorMsg = (error.response?.data as { message: string[] }).message;

  if (typeof errorMsg === "string") {
    toast(errorMsg, { type: "error" });
  } else {
    errorMsg.forEach((msg) => {
      toast(msg, { type: "error" });
    });
  }

  console.error(error);
}

export function isFloat(n: number) {
  return Number(n) === n && n % 1 !== 0;
}

export const getInvitationFailedReason = (
  status: MilestoneInvitationStatus,
): FailedReason | null => {
  switch (status) {
    case "INVITATION_EXPIRED":
      return "invitationExpired";
    case "REMOVED":
      return "invitationRemoved";
    case "INVITATION_CANCELED":
      return "invitationCanceled";
    default:
      return null;
  }
};

export function getMilestoneInvitationStyle(
  status?: MilestoneInvitationStatus,
  isDirty?: boolean,
) {
  if (!status) {
    return {
      statusTextColor: undefined,
      leaderInfoColor: theme.text.primary,
      bgColor: theme.neutralWhite,
      lineColor: undefined,
      clearBtnColor: theme.colors.BN200,
      clearBtnHoverColor: theme.text.secondary,
    };
  } else if (status === "PENDING_INVITATION" || isDirty) {
    return {
      statusTextColor: theme.colors.BN300,
      leaderInfoColor: theme.colors.BN300,
      bgColor: theme.colors.BN50,
      lineColor: theme.colors.BN100,
      clearBtnColor: theme.colors.BN200,
      clearBtnHoverColor: theme.text.secondary,
    };
  } else if (status === "INVITATION_ACCEPTED") {
    return {
      statusTextColor: undefined,
      leaderInfoColor: theme.text.primary,
      bgColor: theme.neutralWhite,
      lineColor: undefined,
      clearBtnColor: theme.colors.BN200,
      clearBtnHoverColor: theme.text.secondary,
    };
  } else if (
    status === "INVITATION_EXPIRED" ||
    status === "INVITATION_REJECTED" ||
    status === "REMOVED"
  ) {
    return {
      statusTextColor: theme.error.primary,
      leaderInfoColor: theme.colors.RS200,
      bgColor: theme.error.light,
      lineColor: theme.colors.RS200,
      clearBtnColor: theme.colors.RS400,
      clearBtnHoverColor: theme.error.primary,
    };
  } else {
    return {
      statusTextColor: undefined,
      leaderInfoColor: theme.text.primary,
      bgColor: theme.neutralWhite,
      lineColor: undefined,
      clearBtnColor: theme.colors.BN200,
      clearBtnHoverColor: theme.text.secondary,
    };
  }
}

export const YEAR_OF_EXP_MAPPING: Record<string, string> = {
  A: "1 年以內",
  B: "1-3 年",
  C: "3-5 年",
  D: "5-10 年",
  E: "10 年以上",
};

export const year_of_exp_options = Object.entries(YEAR_OF_EXP_MAPPING).map(
  ([key, value]) => ({ label: value, value: key }),
);

export const AVAILABLE_WEEKLY_HOURS_MAPPING: Record<string, string> = {
  A: "10 小時",
  B: "10-20 小時",
  C: "20-40 小時",
};

export const available_weekly_hours_options = Object.entries(
  AVAILABLE_WEEKLY_HOURS_MAPPING,
).map(([key, value]) => ({ label: value, value: key }));

export const EXPECTED_HOURLY_RATES_MAPPING: Record<string, string> = {
  A: "500 /小時",
  B: "600 /小時",
  C: "700 /小時",
  D: "800 /小時",
};

export const expected_hourly_rates_options = Object.entries(
  EXPECTED_HOURLY_RATES_MAPPING,
).map(([key, value]) => ({ label: value, value: key }));

export const EXPERTISES_MAPPING: Record<string, string> = {
  A: "機構設計",
  B: "ID設計",
  C: "電路設計",
  D: "韌體",
  E: "Layout",
};

export const expertises_options = Object.entries(EXPERTISES_MAPPING).map(
  ([key, value]) => ({ label: value, value: key }),
);

export const getExpectedHourlyRatesRange = (
  expectedHourlyRates: string[],
): { max: number; min: number } => {
  let min = 0;
  let max = 0;
  expectedHourlyRates.forEach((hourlyRate) => {
    const isRateExist = !!EXPECTED_HOURLY_RATES_MAPPING[hourlyRate];
    const rate = isRateExist
      ? parseInt(EXPECTED_HOURLY_RATES_MAPPING[hourlyRate].split("/")[0])
      : 0;

    // Skip if rate is not a number
    if (Number.isNaN(rate) || !isRateExist) return;

    if (min === 0 || rate < min) min = rate;
    if (rate > max) max = rate;
  });

  return { max, min };
};

export const getActualHourlyRatesRange = (
  actualHourlyRates: UserSalary[],
): { max: number; min: number } => {
  let min = 0;
  let max = 0;

  actualHourlyRates.forEach((hourlyRate) => {
    if (min === 0 || min > hourlyRate.min) min = hourlyRate.min;
    if (max === 0 || max < hourlyRate.max) max = hourlyRate.max;
  });

  return { min, max };
};

export const hourly_rate_options = [
  { label: "0-500", value: "500" },
  { label: "501-1000", value: "1000" },
  { label: "1001-1500", value: "1500" },
  { label: "1501-2000", value: "2000" },
  { label: "2001+", value: "2001" },
];

export const skills_options = [
  { label: "前端開發", value: "frontend" },
  { label: "後端開發", value: "backend" },
  { label: "全端開發", value: "fullstack" },
  { label: "UI/UX設計", value: "ui_ux" },
  { label: "DevOps", value: "devops" },
  { label: "資料庫管理", value: "database" },
  { label: "雲端架構", value: "cloud" },
  { label: "資訊安全", value: "security" },
  { label: "人工智慧", value: "ai" },
  { label: "區塊鏈", value: "blockchain" },
];

export const experiences_options = [
  { label: "1年以下", value: "0-1" },
  { label: "1-3年", value: "1-3" },
  { label: "3-5年", value: "3-5" },
  { label: "5-10年", value: "5-10" },
  { label: "10年以上", value: "10+" },
];

export const working_type_options = [
  { label: "全職", value: "FULLTIME" },
  { label: "兼職", value: "PARTTIME" },
  { label: "全職和兼職", value: "BOTH" },
];

export const WORKING_TYPE_MAPPING: Record<string, string> = {
  FULLTIME: "全職",
  PARTTIME: "兼職",
  BOTH: "全職和兼職",
};

export const PREFERRED_WORK_STYLE_MAPPING: Record<string, string> = {
  REMOTE: "遠端工作",
  ONSITE: "現場工作",
  HYBRID: "混合模式",
};

export const PREFERRED_PROJECT_DURATION_MAPPING: Record<string, string> = {
  SHORT: "短期（3個月以下）",
  MEDIUM: "中期（3-6個月）",
  LONG: "長期（6個月以上）",
};
