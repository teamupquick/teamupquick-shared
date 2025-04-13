/**
 * 專案常量定義文件
 * 集中定義專案中使用的狀態、優先級等常量及其對應的顏色和中文標籤
 */

import type { Priority, Status } from "./types";

// ===== 狀態定義 =====
export const STATUS_TYPES = {
  PREPARATION: "PREPARATION" as const,
  WAITING: "WAITING" as const,
  IN_PROGRESS: "IN_PROGRESS" as const,
  PENDING: "PENDING" as const,
  COMPLETED: "COMPLETED" as const,
  CLOSED: "CLOSED" as const,
  CANCELED: "CANCELED" as const,
  PENDING_EXECUTION: "PENDING_EXECUTION" as const,
  PENDING_CLOSURE: "PENDING_CLOSURE" as const,
};

// 狀態中文標籤
export const STATUS_LABELS: Record<string, string> = {
  [STATUS_TYPES.PREPARATION]: "準備中",
  [STATUS_TYPES.WAITING]: "待執行",
  [STATUS_TYPES.IN_PROGRESS]: "進行中",
  [STATUS_TYPES.PENDING]: "暫停",
  [STATUS_TYPES.COMPLETED]: "完成",
  [STATUS_TYPES.CLOSED]: "結案",
  [STATUS_TYPES.CANCELED]: "取消",
  [STATUS_TYPES.PENDING_EXECUTION]: "待執行",
  [STATUS_TYPES.PENDING_CLOSURE]: "待結案",
};

// 狀態顏色 - 使用台灣常見配色
export const STATUS_COLORS: Record<string, string> = {
  [STATUS_TYPES.PREPARATION]: "#DCDAFF", // 淡紫色
  [STATUS_TYPES.WAITING]: "#FFF4CF", // 淡鵝黃色
  [STATUS_TYPES.IN_PROGRESS]: "#C7E8FF", // 天空藍
  [STATUS_TYPES.PENDING]: "#FFE0B2", // 淡橘色
  [STATUS_TYPES.COMPLETED]: "#DCEDC8", // 淡青草綠
  [STATUS_TYPES.CLOSED]: "#D0D0D0", // 淡灰色
  [STATUS_TYPES.CANCELED]: "#FFCDD2", // 淡珊瑚紅
  [STATUS_TYPES.PENDING_EXECUTION]: "#FF9800", // 橙色
  [STATUS_TYPES.PENDING_CLOSURE]: "#9C27B0", // 紫色
};

// 狀態標籤顏色 (文字顏色)
export const STATUS_LABEL_COLORS: Record<string, string> = {
  [STATUS_TYPES.PREPARATION]: "#5E35B1", // 深紫色文字
  [STATUS_TYPES.WAITING]: "#FF8F00", // 琥珀色文字
  [STATUS_TYPES.IN_PROGRESS]: "#0277BD", // 藍色文字
  [STATUS_TYPES.PENDING]: "#EF6C00", // 橘色文字
  [STATUS_TYPES.COMPLETED]: "#2E7D32", // 綠色文字
  [STATUS_TYPES.CLOSED]: "#424242", // 灰色文字
  [STATUS_TYPES.CANCELED]: "#C62828", // 紅色文字
  [STATUS_TYPES.PENDING_EXECUTION]: "#FF5722", // 深橙色文字
  [STATUS_TYPES.PENDING_CLOSURE]: "#673AB7", // 深紫色文字
};

// ===== 優先級定義 =====
export const PRIORITY_TYPES = {
  HIGH: "HIGH" as const,
  MEDIUM: "MEDIUM" as const,
  LOW: "LOW" as const,
  URGENT: "URGENT" as const,
};

// 優先級中文標籤
export const PRIORITY_LABELS: Record<string, string> = {
  [PRIORITY_TYPES.URGENT]: "緊急",
  [PRIORITY_TYPES.HIGH]: "高",
  [PRIORITY_TYPES.MEDIUM]: "普通",
  [PRIORITY_TYPES.LOW]: "低",
};

// 優先級顏色 - 使用台灣常見配色
export const PRIORITY_COLORS: Record<string, string> = {
  [PRIORITY_TYPES.HIGH]: "#FFD6D6", // 淡紅色
  [PRIORITY_TYPES.MEDIUM]: "#FFF4CF", // 淡鵝黃色
  [PRIORITY_TYPES.LOW]: "#DCEDC8", // 淡青草綠
  [PRIORITY_TYPES.URGENT]: "#FFB74D", // 明亮橘色
};

// 優先級標籤顏色 (文字顏色)
export const PRIORITY_LABEL_COLORS: Record<string, string> = {
  [PRIORITY_TYPES.HIGH]: "#D32F2F", // 紅色文字
  [PRIORITY_TYPES.MEDIUM]: "#FF8F00", // 琥珀色文字
  [PRIORITY_TYPES.LOW]: "#388E3C", // 綠色文字
  [PRIORITY_TYPES.URGENT]: "#D84315", // 深橘色文字
};

// 下拉選項格式
export const STATUS_OPTIONS = Object.entries(STATUS_LABELS)
  .filter(([key]) =>
    [
      STATUS_TYPES.PREPARATION,
      STATUS_TYPES.WAITING,
      STATUS_TYPES.IN_PROGRESS,
      STATUS_TYPES.PENDING,
      STATUS_TYPES.COMPLETED,
      STATUS_TYPES.CLOSED,
      STATUS_TYPES.CANCELED,
      STATUS_TYPES.PENDING_EXECUTION,
      STATUS_TYPES.PENDING_CLOSURE,
    ].includes(key as Status),
  )
  .map(([key, value]) => ({ label: value, value: key }));

export const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS).map(
  ([key, value]) => ({ label: value, value: key }),
);

// 輔助函數 - 獲取狀態標籤
export const getStatusLabel = (status: string): string => {
  return STATUS_LABELS[status] || status;
};

// 輔助函數 - 獲取優先級標籤
export const getPriorityLabel = (priority: string): string => {
  return PRIORITY_LABELS[priority] || priority;
};

// 輔助函數 - 獲取狀態顏色
export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status] || "#E0E0E0"; // 默認淺灰色
};

// 輔助函數 - 獲取優先級顏色
export const getPriorityColor = (priority: string): string => {
  return PRIORITY_COLORS[priority] || "#E0E0E0"; // 默認淺灰色
};