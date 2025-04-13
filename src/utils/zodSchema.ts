import { z } from "zod";
import type { Priority, Status } from "./types";

// 必填訊息常量
const REQUIRED_MSG = "此為必填欄位";

// 優先級列表
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

// 狀態列表
const STATUSES = [
  "PREPARATION",
  "WAITING",
  "IN_PROGRESS",
  "PENDING",
  "COMPLETED",
  "CLOSED",
  "CANCELED",
] as const;

// 任務類別列表
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

// 專案客戶類型
const PROJECT_CLIENT_TYPES = ["USER", "COMPANY"] as const;

// 使用Zod定義驗證模式
export const taskZodSchema = z.object({
  name: z.string().nonempty(REQUIRED_MSG),
  description: z.string().nonempty(REQUIRED_MSG),
  assigneeId: z.number().int().positive(),
  categoryId: z.number().int().positive().optional(),
  priority: z.enum(PRIORITIES),
  status: z.enum(STATUSES),
  budgetedHours: z.number().positive("預算時數必須大於0"),
  serviceFee: z.number().optional(),
  budget: z.number().optional(),
  cost: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  version: z.number().optional(),
  // 自定義類別
  customCategory: z.string().optional(),
});

// 導出類型定義
export type TaskFormValidation = z.infer<typeof taskZodSchema>;

export const projectZodSchema = z.object({
  name: z.string().nonempty("專案名稱為必填"),
  description: z.string().nonempty("專案描述為必填"),
  budgetedHours: z.number().positive("時數必須大於0"),
  priority: z.enum(PRIORITIES),
  status: z.enum(STATUSES),
  clientType: z.enum(PROJECT_CLIENT_TYPES),
  clientCompanyUserId: z.number().nullable().optional(),
  clientCompanyId: z.number().nullable().optional(),
  customClientName: z.string().nullable().optional(),
  categoryId: z.number().nullable().optional(),
  customCategory: z.string().nullable().optional(),
  assigneeId: z.number().positive("專案負責人為必填"),
  startDate: z.date(),
  endDate: z.date(),
});

export type ProjectFormValidation = z.infer<typeof projectZodSchema>;
