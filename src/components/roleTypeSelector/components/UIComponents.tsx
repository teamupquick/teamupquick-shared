import { Box, Typography, CircularProgress } from "@mui/material";

/**
 * 角色類型選擇器的標題組件
 */
export function SelectorLabel({ label }: { label: string }) {
  return (
    <Typography
      sx={{
        color: "#4D5464",
        fontSize: "14px",
        lineHeight: "24px",
        marginBottom: "4px",
      }}
    >
      {label}
    </Typography>
  );
}

/**
 * 加載中指示器組件
 */
export function LoadingIndicator() {
  return (
    <Box display="flex" justifyContent="center" padding="10px">
      <CircularProgress size={24} />
    </Box>
  );
}
