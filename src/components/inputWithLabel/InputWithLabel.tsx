import {
  BaseTextFieldProps,
  Box,
  FormHelperText,
  InputLabel,
  InputProps,
  makeStyles,
  StandardTextFieldProps,
  styled,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { MainColors } from "@shared/utils/utils";
import { ChangeEvent } from "react";

// 定義自己的Role類型來替代從SignUp引入的
type Role = "engineer" | "business" | string;

interface Props extends StandardTextFieldProps {
  // label?: string
  // placeholder: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  errorMsg?: string;
  value: string;
  role?: Role; // 添加可選的role參數
}

const getColor = (role: Role = "engineer", error: boolean, value: string) => {
  if (error) return "#EB3D4D";
  if (!value) return "";

  // 確保role是有效的索引
  if (role === "engineer" || role === "business") {
    return MainColors[role as keyof typeof MainColors];
  }

  // 默認顏色
  return MainColors.engineer;
};

export default function InputWithLabel({
  label,
  placeholder,
  onChange,
  errorMsg,
  value,
  slotProps,
  role = "engineer", // 為role提供默認值
  ...props
}: Props) {
  const error = !!errorMsg;
  const color = getColor(role, error, value);

  return (
    <>
      {!!label && (
        <InputLabel
          sx={{
            fontSize: "14px",
            fontWidth: "500",
            mb: "4px",
            color: "#4D5464",
          }}
        >
          {label}
        </InputLabel>
      )}
      <Box position="relative">
        <TextField
          {...props}
          value={value}
          variant="outlined"
          placeholder={placeholder}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              height: "40px",
              color: color,
              background: error ? "#FEECEE" : "#F9F9FC",
              borderRadius: "4px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#E9E9EA",
              },

              "&.Mui-error": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FBD8DB",
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: error
                    ? "#EB3D4D"
                    : MainColors[
                        role === "engineer" || role === "business"
                          ? role
                          : "engineer"
                      ],
                },
              },
              "&:hover:not(.Mui-focused)": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: error
                    ? "#EB3D4D"
                    : MainColors[
                        role === "engineer" || role === "business"
                          ? role
                          : "engineer"
                      ],
                },
              },
            },
          }}
          slotProps={{
            ...slotProps,
            input: {
              ...slotProps?.input,
              sx: {
                height: "40px",
                fontSize: "14px",
              },
            },
          }}
          onChange={onChange}
          error={error}
        />
        <FormHelperText sx={{ color: "#EB3D4D", fontSize: "12px" }}>
          {errorMsg}
        </FormHelperText>
      </Box>
    </>
  );
}
