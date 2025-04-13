import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material"

interface Props extends ButtonProps {}

export default function FormButton({ children, sx, ...props }: Props) {
  return (
    <Button
      {...props}
      sx={{
        padding: "16px",
        fontSize: "16px",
        fontWeight: 700,
        color: "white",
        background: props.disabled ? "#D2D2D5" : "#3B3839",
        borderRadius: "100px",
        "&.Mui-disabled": {
          color: "white",
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  )
}
