import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material"
import React, { ReactNode } from "react"
import CloseIcon from "@mui/icons-material/Close"
import { theme } from "@shared/utils/theme"

interface Props {
  title: string
  children?: ReactNode
  primaryBtnLabel: string
  secondaryBtnLabel: string
  onCancel: VoidFunction
  onConfirm: VoidFunction
}

export default function PromptDialog(props: Props) {
  const {
    title,
    children,
    primaryBtnLabel,
    secondaryBtnLabel,
    onCancel,
    onConfirm,
  } = props

  return (
    <Dialog
      open={true}
      onClose={() => {}}
      PaperProps={{
        sx: {
          borderRadius: "8px",
          minWidth: "384px",
        },
      }}
    >
      <DialogTitle sx={{ p: "24px", color: theme.text.primary }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {title}
          <IconButton
            sx={{ px: "0px", color: theme.neutralBlack }}
            onClick={onCancel}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: "24px", color: theme.text.quaternary }}>
        {children}
      </DialogContent>
      <DialogActions sx={{ p: "24px" }}>
        <Button
          variant="outlined"
          sx={{ borderColor: theme.text.primary, color: theme.text.primary }}
          onClick={onCancel}
        >
          {secondaryBtnLabel}
        </Button>
        <Button
          variant="contained"
          sx={{ marginLeft: "16px", backgroundColor: theme.text.primary }}
          onClick={onConfirm}
        >
          {primaryBtnLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
