/**
 * 通用的分頁響應DTO
 */
export interface PaginationResponseDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 通用的基礎實體DTO
 */
export interface BaseEntityDto {
  id: number;
  createdAt: string;
  updatedAt: string;
}
/**
 * 日期範圍類型
 */
export interface Range {
  startDate: Date;
  endDate: Date;
  key: string;
}