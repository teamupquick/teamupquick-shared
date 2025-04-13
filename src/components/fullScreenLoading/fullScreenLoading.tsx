import { Box, CircularProgress, Typography } from "@mui/material"

type Props = {
  label: string
}

export default function FullScreenLoading({ label }: Props) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <CircularProgress size={80} />
      <Typography fontSize={18} mt="16px">
        {label}
      </Typography>
    </Box>
  )
}
