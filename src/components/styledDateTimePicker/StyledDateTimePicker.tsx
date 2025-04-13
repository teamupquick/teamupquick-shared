import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  Button,
  FormHelperText,
  InputLabel,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { theme } from "@shared/utils/theme";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { getTextFieldStyle } from "@shared/utils/utils";

interface Props {
  label?: string;
  onChange: (value: Dayjs | null) => void;
  value: Dayjs | null;
  defaultValue?: Dayjs;
  errorMsg?: string;
}

export default function StyledDateTimePicker(props: Props) {
  const { label, onChange, value, defaultValue, errorMsg } = props;

  // 明確指定保留到毫秒
  const handleNowClick = () => {
    const now = dayjs();
    console.log("現在時間（包含毫秒）:", now.format("YYYY-MM-DD HH:mm:ss.SSS"));
    onChange(now);
  };

  // 清除時間值
  const handleClearClick = () => {
    onChange(null);
  };

  // 生成隨機秒數的函數
  const getRandomSeconds = () => {
    return Math.floor(Math.random() * 60);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateTimePicker"]}>
        <InputLabel
          sx={{
            lineHeight: "24px",
            fontSize: "14px",
            color: theme.text.tertiary,
          }}
        >
          {label}
        </InputLabel>
        <Box sx={{ position: "relative", width: "100%" }}>
          <DateTimePicker
            ampm={false}
            format="YYYY-MM-DD HH:mm"
            sx={{
              ...getTextFieldStyle(!!errorMsg),
              "&.MuiFormControl-root": { mt: "4px", width: "100%" },
            }}
            slotProps={{
              textField: {
                disabled: false,
                InputProps: {
                  startAdornment: (
                    <Button
                      variant="outlined"
                      sx={{
                        color: theme.text.primary,
                        borderColor: theme.border.secondary,
                        mr: "8px",
                      }}
                      onClick={handleNowClick}
                    >
                      現在
                    </Button>
                  ),
                },
              },
            }}
            onChange={(v: Dayjs | null) => {
              if (v) {
                // 檢查是手動輸入還是通過選擇器選擇
                // 如果手動輸入後秒數為0，則設置一個隨機秒數
                const randomSec = getRandomSeconds();
                const currentSec = v.second();
                const newValue =
                  currentSec === 0 ? v.set("second", randomSec) : v;

                console.log(
                  "選擇的時間（處理後）:",
                  newValue.format("YYYY-MM-DD HH:mm:ss.SSS"),
                  "是否修改秒:",
                  currentSec === 0,
                );

                onChange(newValue);
              } else {
                onChange(v);
              }
            }}
            value={value}
            defaultValue={defaultValue}
            views={["year", "month", "day", "hours", "minutes"]}
          />

          {/* 右側清除按鈕，絕對定位不影響原有下拉功能 */}
          {value && (
            <IconButton
              onClick={handleClearClick}
              size="small"
              sx={{
                position: "absolute",
                right: "40px", // 預留空間給日期選擇器圖標
                top: "50%",
                transform: "translateY(-50%)",
                color: theme.text.secondary,
                zIndex: 1,
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </DemoContainer>

      <FormHelperText sx={{ color: theme.colors.RS500, fontSize: "12px" }}>
        {errorMsg}
      </FormHelperText>
    </LocalizationProvider>
  );
}
