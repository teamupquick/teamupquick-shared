import * as yup from "yup";
import type {
  Priority,
  ProjectClientType,
  Status,
} from "./types";

const REQUIRED_MSG = "此為必填欄位";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
const STATUSES = [
  "PREPARATION",
  "WAITING",
  "IN_PROGRESS",
  "PENDING",
  "COMPLETED",
  "CLOSED",
  "CANCELED",
] as const;

const TASK_CATEGORIES = [
  "MEETING",
  "CODING",
  "TESTING",
  "PRODUCTION",
  "PURCHASING",
  "DOCUMENT_WRITING_AND_REVIEW",
  "PHYSICAL_SUPPORT",
  "SHIPPING",
  "ACCOUNTING",
  "DESIGN",
  "PRICE_INQUIRY",
  "ASSEMBLY",
  "PROGRAM_ARCHITECTURE_DEFINITION",
  "PROGRAM_MAINTENANCE",
  "COMPONENT_LAYOUT",
  "WIRING_CONNECTION",
  "COMPONENT_LIBRARY_CREATION",
  "BOM_TABLE_CREATION",
  "FIXTURE_CREATION",
  "COMMUTING",
  "MAINTENANCE",
  "OTHER",
] as const;
const PROJECT_CLIENT_TYPES = ["USER", "COMPANY"] as const;

export const projectSchema = yup.object().shape({
  name: yup.string().required("專案名稱為必填"),
  description: yup.string().required("專案描述為必填"),
  budgetedHours: yup.number().positive("時數必須大於0"),
  priority: yup.mixed<Priority>().oneOf(PRIORITIES).required(),
  status: yup.mixed<Status>().oneOf(STATUSES).required(),
  clientType: yup
    .mixed<ProjectClientType>()
    .oneOf(PROJECT_CLIENT_TYPES)
    .required(),
  clientCompanyUserId: yup.number().nullable(),
  clientCompanyId: yup.number().nullable(),
  customClientName: yup.string().nullable(),
  // 支持新的類別選擇方式
  category: yup.mixed().nullable(),
  categoryId: yup.number().nullable(),
  customCategory: yup.string().nullable(),
  assigneeId: yup.number().required("專案負責人為必填"),
  startDate: yup.date().required("開始日期為必填"),
  endDate: yup.date().required("結束日期為必填"),
});

const memberSchema = yup.object().shape({
  hourlyRate: yup.number().required(REQUIRED_MSG),
  role: yup.string().required(REQUIRED_MSG),
  userId: yup.number().required(REQUIRED_MSG),
});

export const milestoneSchema = yup.object().shape({
  name: yup.string().required(REQUIRED_MSG).trim(),
  description: yup.string().required(REQUIRED_MSG).trim(),
  version: yup.number().required(REQUIRED_MSG),
  // 自定義類別只在 category 為 "OTHER" 時必填
  customCategory: yup.string().when("category", {
    is: "OTHER",
    then: (schema) => schema.required(REQUIRED_MSG).trim(),
    otherwise: (schema) => schema.optional(),
  }),
  assigneeId: yup.number().required(REQUIRED_MSG),
  priority: yup.string().required(REQUIRED_MSG).oneOf(PRIORITIES),
  status: yup.string().required(REQUIRED_MSG).oneOf(STATUSES),
  // 人員相關
  members: yup.array().required(REQUIRED_MSG).of(memberSchema).min(0, ""),
  // 時間與預算
  budgetedHours: yup
    .number()
    .required(REQUIRED_MSG)
    .min(0, "預算不能為負數")
    .max(yup.ref("$projectRemainingBudget"), "專案預算不足"),
  startDate: yup.date().required(REQUIRED_MSG),
  endDate: yup.date().required(REQUIRED_MSG),
  leaderId: yup.number().nullable().optional(),
  leaderRate: yup.number().nullable().optional().integer("費率必須為整數"),
});

export const taskSchema = yup.object().shape({
  name: yup.string().required(REQUIRED_MSG).trim(),
  version: yup.number().required(REQUIRED_MSG),
  // 支持新的類別選擇方式
  categoryId: yup.number().nullable(),
  customCategory: yup.string().when("categoryId", {
    is: null,
    then: (schema) => schema.required(REQUIRED_MSG).trim(),
    otherwise: (schema) => schema.optional(),
  }),
  // 保留向後兼容性，但設為可選
  category: yup.string().oneOf(TASK_CATEGORIES).optional(),
  priority: yup.string().required(REQUIRED_MSG).oneOf(PRIORITIES),
  status: yup.string().required(REQUIRED_MSG).oneOf(STATUSES),
  assigneeId: yup.number().required(REQUIRED_MSG),
  budgetedHours: yup
    .number()
    .required(REQUIRED_MSG)
    .max(yup.ref("$milestoneRemainingBudget"), "里程碑預算不足"),
  startDate: yup.date().required(REQUIRED_MSG),
  endDate: yup.date().required(REQUIRED_MSG),
  description: yup.string().required(REQUIRED_MSG).trim(),
});

export const subtaskSchema = yup.object().shape({
  name: yup.string().required(REQUIRED_MSG).trim(),
  version: yup.number().required(REQUIRED_MSG),
  categoryId: yup.number().required(REQUIRED_MSG),
  assigneeId: yup.number().required(REQUIRED_MSG),
  startTime: yup.string().required(REQUIRED_MSG).trim(),
  endTime: yup.string().nullable(),
  description: yup.string().required(REQUIRED_MSG).trim(),
});

// Export type
export type ProjectFormData = yup.InferType<typeof projectSchema>;
export type MilestoneFormData = yup.InferType<typeof milestoneSchema>;
export type TaskFormData = yup.InferType<typeof taskSchema>;
export type SubtaskFormData = yup.InferType<typeof subtaskSchema>;
