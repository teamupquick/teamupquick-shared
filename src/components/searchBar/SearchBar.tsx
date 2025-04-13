import { InputAdornment, TextField } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { ChangeEvent } from "react"
import { theme } from "@shared/utils/theme"

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  style?: any
}

export default function SearchBar({ onChange, placeholder, style }: Props) {
  return (
    <TextField
      variant="outlined"
      placeholder={placeholder ?? "搜尋關鍵字"}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "40px",
          width: "100%",
          backgroundColor: theme.neutralWhite,
          borderRadius: "8px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.border.primary,
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.border.secondary,
              border: "2px solid",
            },
          },
          "&:hover:not(.Mui-focused)": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.border.secondary,
            },
          },
          ...style,
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
      onChange={onChange}
    />
  )
}
