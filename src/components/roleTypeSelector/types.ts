import type { ChangeEvent } from "react";
import type { RoleTypeDto } from "@dto/roleType";

/**
 * 角色層級類型（已棄用但保留向後兼容）
 */
export type RoleLevel = "PROJECT" | "MILESTONE" | "TASK" | "SUBTASK";

/**
 * 共享的事件處理器類型
 */
export type InputChangeHandler = (
  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
) => void;
export type OptionChangeHandler = (
  e: React.SyntheticEvent,
  value: RoleTypeOption | string | null,
) => void;
export type TextInputChangeHandler = (
  e: React.SyntheticEvent,
  value: string,
) => void;
export type KeyDownHandler = (e: React.KeyboardEvent) => void;

/**
 * 角色類型選項結構
 */
export interface RoleTypeOption {
  label: string;
  value: string;
  description?: string;
  code?: string;
  userData?: RoleTypeDto;
}

/**
 * 角色類型選擇器組件屬性
 */
export interface RoleTypeSelectorProps {
  roleTypeId: number | null;
  customValue?: string;
  onChange: (role: RoleTypeDto) => void;
  label?: string;
  placeholder?: string;
  errorMsg?: string;
  disabled?: boolean;
  disableAutoCreate?: boolean;
}

/**
 * 自定義角色表單組件屬性
 */
export interface CustomRoleFormProps {
  visible: boolean;
  inputValue: string;
  codeValue: string;
  descriptionValue: string;
  onCodeChange: InputChangeHandler;
  onDescriptionChange: InputChangeHandler;
}

/**
 * 角色類型輸入組件屬性
 */
export interface RoleTypeInputProps {
  currentValue: RoleTypeOption | null;
  inputValue: string;
  options: RoleTypeOption[];
  placeholder: string;
  errorMsg?: string;
  disabled: boolean;
  onChangeOption: OptionChangeHandler;
  onInputChange: TextInputChangeHandler;
  onKeyDown: KeyDownHandler;
  onCreateClick?: (e: React.MouseEvent) => void;
  showAddButton?: boolean;
  isCreating?: boolean;
}
