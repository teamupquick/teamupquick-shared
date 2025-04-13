import type { StandardTextFieldProps } from "@mui/material";
import {
  Box,
  FormHelperText,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import type { ChangeEvent, ReactNode } from "react";
import { theme } from "@shared/utils/theme";

interface Props extends StandardTextFieldProps {
  onChange?: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  errorMsg?: string;
  value?: string | number;
  readOnly?: boolean;
  endAdornment?: ReactNode;
  children?: ReactNode;
  sx?: any;
  maxLength?: number;
}

export default function InputWithLabelV2({
  label,
  placeholder,
  onChange,
  errorMsg,
  value,
  slotProps,
  readOnly,
  endAdornment,
  prefix,
  children,
  sx,
  maxLength,
  ...props
}: Props) {
  const error = !!errorMsg;

  return (
    <Box sx={sx}>
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
        {children ? (
          children
        ) : (
          <TextField
            {...props}
            value={value}
            variant="outlined"
            placeholder={placeholder}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                //   color: color,
                background: error ? "#FEECEE" : "#F9F9FC",
                borderRadius: "4px",
                "& .MuiOutlinedInput-input": {
                  cursor: readOnly ? "auto" : undefined,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.colors.BN50,
                },
                "&.Mui-error": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FBD8DB",
                  },
                },
                "&.Mui-focused": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: error ? "#EB3D4D" : theme.colors.BN300,
                  },
                },
                "&:hover:not(.Mui-focused)": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: error ? "#EB3D4D" : theme.colors.BN300,
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
                startAdornment: (
                  <InputAdornment position="start">{prefix}</InputAdornment>
                ),
                endAdornment: endAdornment,
                inputProps: {
                  readOnly,
                  maxLength,
                },
              },
            }}
            InputProps={{
              inputProps: {
                readOnly,
                maxLength,
              },
            }}
            onChange={onChange}
            error={error}
          />
        )}
        {errorMsg && (
          <FormHelperText sx={{ color: "#EB3D4D", fontSize: "12px" }}>
            {errorMsg}
          </FormHelperText>
        )}
      </Box>
    </Box>
  );
}
