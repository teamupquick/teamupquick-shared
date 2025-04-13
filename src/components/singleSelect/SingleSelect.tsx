import type {
  SelectProps} from "@mui/material";
import {
  Box,
  FormHelperText,
  MenuItem,
  Select as MuiSelect,
  styled,
  Typography,
} from "@mui/material"
import { theme } from "@shared/utils/theme"
import type { ReactNode } from "react"

const FormSelectInput = styled(MuiSelect)<{}>(
  {
    width: "100%",
    height: "40px",
    color: theme.text.primary,
    fontSize: "14px",
  },
  props => ({
    fieldset: {
      borderColor: "#E9E9EA",
    },
    "&.Mui-focused": {
      "& fieldset": {
        borderColor: `${theme.border.secondary} !important`,
      },
    },
    "&.Mui-error": {
      backgroundColor: theme.colors.RS50,
      "& fieldset": {
        borderColor: `${theme.colors.RS100} !important`,
      },
      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: `${theme.colors.RS500} !important`,
        },
      },
      "&:hover:not(.Mui-focused)": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: `${theme.colors.RS500} !important`,
        },
      },
    },
  }),
)

interface Props extends Omit<SelectProps<string>, "onChange"> {
  value: string
  onChange: (value: string) => void
  options: { label: ReactNode; value: string; disabled?: boolean }[]
  errorMsg?: string
  showNoneOption?: boolean
}

export default function SingleSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  sx: restSx,
  errorMsg,
  showNoneOption,
  ...props
}: Props) {
  const error = !!errorMsg
  const actualPlaceholder = placeholder ?? "請選擇 (單選)"

  return (
    <Box component="section">
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
      <MuiSelect
        displayEmpty
        value={value}
        input={<FormSelectInput />}
        placeholder={actualPlaceholder}
        sx={{ color: value ? "" : theme.text.secondary, ...restSx }}
        onChange={e => onChange(e.target.value)}
        error={error}
        renderValue={selected => {
          // show placeholder if no value is selected
          if (selected === "") {
            return (
              <span style={{ color: theme.text.secondary }}>
                {actualPlaceholder}
              </span>
            )
          }

          // show selected option label
          const selectedOption = options.find(
            option => option.value === selected,
          )
          return selectedOption?.label || selected
        }}
        {...props}
      >
        <MenuItem disabled value={""}>
          {actualPlaceholder}
        </MenuItem>
        {showNoneOption && <MenuItem value="">None</MenuItem>}
        {options.map(option => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled ?? false}
          >
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>

      <FormHelperText sx={{ color: theme.colors.RS500, fontSize: "12px" }}>
        {errorMsg}
      </FormHelperText>
    </Box>
  )
}
