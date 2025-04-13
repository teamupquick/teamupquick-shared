import {
  TextField,
  FormHelperText,
  Autocomplete,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import type { RoleTypeInputProps } from "../types";
import { Z_INDEX } from "@shared/constants/zIndex";

/**
 * 角色類型輸入組件
 * 包含自動完成輸入框和錯誤提示
 */
export function RoleTypeInput({
  currentValue,
  inputValue,
  options,
  placeholder,
  errorMsg,
  disabled,
  onChangeOption,
  onInputChange,
  onKeyDown,
  onCreateClick,
  showAddButton,
  isCreating,
}: RoleTypeInputProps) {
  return (
    <>
      <Autocomplete
        value={currentValue}
        onChange={onChangeOption}
        inputValue={inputValue}
        onInputChange={onInputChange}
        options={options}
        getOptionLabel={(option) => {
          if (typeof option === "string") return option;
          return option.label;
        }}
        isOptionEqualToValue={(option, value) => {
          return option.value === value.value;
        }}
        disabled={disabled}
        freeSolo
        selectOnFocus
        clearOnBlur
        clearOnEscape
        handleHomeEndKeys
        fullWidth
        slotProps={{
          popper: {
            style: {
              zIndex: Z_INDEX.LAYER5.AUTOCOMPLETE,
              position: "fixed",
            },
            modifiers: [
              {
                name: "preventOverflow",
                enabled: true,
                options: {
                  altAxis: true,
                  altBoundary: true,
                  tether: true,
                  rootBoundary: "document",
                  padding: 8,
                },
              },
            ],
          },
          paper: {
            style: {
              zIndex: Z_INDEX.LAYER5.AUTOCOMPLETE,
            },
          },
        }}
        disablePortal={false}
        sx={{
          "& .MuiAutocomplete-popper": {
            zIndex: Z_INDEX.LAYER5.AUTOCOMPLETE,
            position: "fixed !important",
          },
          "& .MuiAutocomplete-endAdornment": {
            // 確保按鈕有足夠的空間
            right: showAddButton ? "36px" : "14px",
          },
        }}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <li key={key || option.value} {...otherProps}>
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            error={!!errorMsg}
            onKeyDown={onKeyDown}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {showAddButton && (
                    <InputAdornment
                      position="end"
                      style={{ position: "absolute", right: "40px" }}
                    >
                      <Tooltip title="立即創建並選擇此角色類型">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={onCreateClick}
                          disabled={disabled || isCreating}
                          color="primary"
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": {
                height: "40px",
                fontSize: "14px",
                padding: "0 10px",
                borderRadius: "4px",
                background: disabled ? "#F9F9FB" : "#fff",
              },
              "& .MuiAutocomplete-listbox": {
                zIndex: Z_INDEX.LAYER5.AUTOCOMPLETE,
              },
              "& .MuiAutocomplete-paper": {
                position: "fixed",
                zIndex: Z_INDEX.LAYER5.AUTOCOMPLETE,
              },
            }}
          />
        )}
      />

      {errorMsg && (
        <FormHelperText error sx={{ marginLeft: "14px" }}>
          {errorMsg}
        </FormHelperText>
      )}
    </>
  );
}
