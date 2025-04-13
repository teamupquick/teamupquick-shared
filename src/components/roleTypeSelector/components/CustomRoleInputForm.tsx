import { Box } from "@mui/material";
import InputWithLabelV2 from "@shared/components/inputWithLabelV2.tsx/InputWithLabelV2";
import type { CustomRoleFormProps } from "../types";

/**
 * 自定義角色輸入表單組件
 * 提供代碼和描述的輸入欄位
 */
export function CustomRoleInputForm({
  visible,
  inputValue,
  codeValue,
  descriptionValue,
  onCodeChange,
  onDescriptionChange,
}: CustomRoleFormProps) {
  if (!visible || !inputValue.trim()) return null;

  return (
    <Box mt={2}>
      <Box mb={2}>
        <InputWithLabelV2
          label="角色類型代碼"
          placeholder="請輸入角色類型的代碼(英文、數字和下劃線，建議全大寫)"
          value={codeValue}
          onChange={onCodeChange}
        />
      </Box>
      <InputWithLabelV2
        label="角色類型描述"
        placeholder="請輸入角色類型的描述"
        value={descriptionValue}
        onChange={onDescriptionChange}
      />
    </Box>
  );
}
