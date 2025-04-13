/** @jsxImportSource react */
import type * as React from "react";
import {
  CircularProgress,
  Box,
  TextField,
  Autocomplete,
  Typography,
  FormHelperText,
  InputAdornment,
  IconButton,
  Tooltip,
  createFilterOptions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputWithLabelV2 from "@shared/components/inputWithLabelV2.tsx/InputWithLabelV2";
import { Z_INDEX } from "../../constants/zIndex";
import type { CategoryOption } from "./types";

interface TypeSelectorUIProps {
  // 基本屬性
  label: string;
  placeholder: string;
  errorMsg?: string;
  disabled: boolean;
  isLoading: boolean;

  // 狀態
  inputValue: string;
  descriptionValue: string;
  isCustomSelected: boolean;
  showAddButton: boolean;
  isCreating: boolean;
  isNewCategory: () => boolean;

  // 資料和選項
  currentValue: CategoryOption | null;
  options: CategoryOption[];
  searchOptions?: CategoryOption[]; // 用於搜尋的所有選項
  filterSearchResults?: (options: CategoryOption[]) => CategoryOption[]; // 過濾搜尋結果的函數

  // 事件處理
  onChangeOption: (
    event: React.SyntheticEvent,
    option: CategoryOption | string | null,
  ) => void;
  onInputChange: (event: React.SyntheticEvent, newInputValue: string) => void;
  onDescriptionChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onCreateAndSelect: () => void;
}

export const TypeSelectorUI: React.FC<TypeSelectorUIProps> = ({
  label,
  placeholder,
  errorMsg,
  disabled,
  isLoading,

  inputValue,
  descriptionValue,
  isCustomSelected,
  showAddButton,
  isCreating,
  isNewCategory,

  currentValue,
  options,
  searchOptions,
  filterSearchResults,

  onChangeOption,
  onInputChange,
  onDescriptionChange,
  onKeyDown,
  onCreateAndSelect,
}) => {
  return (
    <Box component="section" sx={{ position: "relative", overflow: "visible" }}>
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

      {isLoading || isCreating ? (
        <Box display="flex" justifyContent="center" padding="10px">
          <CircularProgress size={24} />
        </Box>
      ) : (
        <>
          <Autocomplete
            value={currentValue}
            onChange={onChangeOption}
            inputValue={inputValue}
            onInputChange={onInputChange}
            options={options}
            filterOptions={(options, state) => {
              // 如果提供了搜尋選項和過濾函數，則使用它們進行搜尋
              if (searchOptions && state.inputValue) {
                // 使用默認的過濾邏輯在所有選項中搜尋
                const defaultFilterOptions =
                  createFilterOptions<CategoryOption>();
                const allFilteredOptions = defaultFilterOptions(
                  searchOptions,
                  state,
                );
                // 始終顯示所有 allCategories 中的匹配選項，不進行過濾
                // 這樣用戶就可以看到並選擇不在 categories 中的選項
                return allFilteredOptions;
              }

              // 否則使用默認的過濾邏輯
              return options;
            }}
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              return option.label;
            }}
            isOptionEqualToValue={(option, value) => {
              return option.value === value.value;
            }}
            disabled={disabled || isCreating}
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
            componentsProps={{
              popper: {
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
                style: {
                  zIndex: Z_INDEX.LAYER5.AUTOCOMPLETE,
                  position: "fixed",
                },
              },
            }}
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
              return (
                <li {...props} key={option.userData?.id || option.value}>
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
                          <Tooltip title="立即創建並選擇此類型">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={(e) => {
                                console.log("[TypeSelectorUI] + 按鈕被點擊");
                                onCreateAndSelect();
                              }}
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

          {isCustomSelected && inputValue.trim() && isNewCategory() && (
            <Box mt={2}>
              <InputWithLabelV2
                label="類型描述"
                placeholder="請輸入類型的描述"
                value={descriptionValue}
                onChange={onDescriptionChange}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
