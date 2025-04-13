import {
  Box,
  FormHelperText,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
  SelectProps,
  styled,
  Typography,
} from "@mui/material"
import { theme } from "@shared/utils/theme"
import { ReactNode } from "react"

const FormSelectInput = styled(MuiSelect)<{}>(
  {
    width: "100%",
    height: "40px",
    color: theme.text.primary,
    fontSize: "14px",
  },
  props => ({
    fieldset: {
      borderColor: theme.colors.BN50,
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

interface Props extends Omit<SelectProps<string[]>, "onChange"> {
  value: string[]
  onChange: (value: string[]) => void
  options: { label: ReactNode; value: string; disabled?: boolean }[]
  errorMsg?: string
}

export default function MultiSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  sx: restSx,
  errorMsg,
  ...props
}: Props) {
  const error = !!errorMsg

  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    const {
      target: { value: newValue },
    } = event
    onChange(typeof newValue === "string" ? newValue.split(",") : newValue)
  }

  return (
    <Box component="section">
      <Typography
        sx={{
          color: theme.text.tertiary,
          fontSize: "14px",
          lineHeight: "24px",
          marginBottom: "4px",
        }}
      >
        {label}
      </Typography>
      <MuiSelect
        multiple
        displayEmpty
        value={value}
        input={<FormSelectInput />}
        sx={{ color: value.length ? "" : theme.text.secondary, ...restSx }}
        onChange={handleChange}
        error={error}
        renderValue={selected => {
          if (selected.length === 0) {
            return placeholder ?? "請選擇 (多選)"
          }

          return selected
            .map(value => {
              const option = options.find(opt => opt.value === value)
              return option ? option.label : value
            })
            .join(", ")
        }}
        {...props}
      >
        <MenuItem disabled value="">
          {placeholder ?? "請選擇 (多選)"}
        </MenuItem>
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
