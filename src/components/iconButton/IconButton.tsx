import { Button, ButtonProps } from "@mui/material"
import { theme } from "@shared/utils/theme"

interface Props extends ButtonProps {
  label: string
}

function getColors(
  disabled?: boolean,
  isContained?: boolean,
  isText?: boolean,
) {
  if (isText && disabled) {
    return {
      color: theme.colors.BN100,
      borderColor: "",
      backgroundColor: "",
    }
  } else if (disabled)
    return {
      color: theme.neutralWhite,
      borderColor: "",
      backgroundColor: theme.colors.BN100,
    }
  else if (isContained) {
    return {
      color: theme.neutralWhite,
      borderColor: "",
      backgroundColor: theme.text.primary,
    }
  } else {
    return {
      color: theme.text.primary,
      borderColor: theme.border.secondary,
      backgroundColor: "",
    }
  }
}

export default function IconButton(props: Props) {
  const { label, startIcon, variant, onClick, sx, disabled, ...restProps } =
    props
  const isContained = variant === "contained"
  const isText = variant === "text"
  const colors = getColors(disabled, isContained, isText)

  return (
    <Button
      disabled={disabled}
      variant={variant ?? "outlined"}
      sx={{
        height: "40px",
        color: colors.color,
        borderColor: colors.borderColor,
        backgroundColor: colors.backgroundColor,
        borderRadius: "8px",
        "&.Mui-disabled": {
          color: colors.color,
          borderColor: colors.borderColor,
          backgroundColor: colors.backgroundColor,
        },
        ...sx,
      }}
      startIcon={startIcon}
      onClick={onClick}
      {...restProps}
    >
      {label}
    </Button>
  )
}
