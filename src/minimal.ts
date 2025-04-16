/**
 * Minimal shared utilities
 * This file contains essential functionality for the shared library
 * without dependencies on problematic components or libraries.
 */

// SVG icon interface for consistent typing
export interface SVGProps {
  width?: number;
  height?: number;
  color?: string;
}

// Export basic utility functions
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount);
};

// 定義基本的路由常量
export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/",
  PROFILE: "/profile",
  PROJECTS: "/projects",
  SETTINGS: "/settings",
};

// 定義本地存儲鍵名
export const LOCAL_STORAGE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  userId: "userId",
  userRole: "userRole",
  userName: "userName",
};

// 定義 API URL
export const API_URL = "http://localhost:3000"; 