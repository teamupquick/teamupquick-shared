import InputWithLabelV2 from "@shared/components/inputWithLabelV2.tsx/InputWithLabelV2";
import { Box, Button, Typography, Slider } from "@mui/material";
import { theme } from "@shared/utils/theme";
import { Fragment, useEffect, useState } from "react";
import BudgetTips from "./BudgetTips";

// 預設橙色警告顏色
const WARNING_COLOR = "#FFA500";

type BudgetType = "milestone" | "task";

interface Props {
  value: string;
  onBudgetChange: (b: string) => void;
  budgetType: BudgetType;
  totalBudget: number;
  remainingBudget: number;
  originalBudget?: number; // 編輯模式下的原有預算
  errorMsg?: string;
  isEditing?: boolean; // 是否處於編輯模式
  minBudget?: number; // 最低預算限制
}

function getBudgetText(budgetType: BudgetType) {
  if (budgetType === "milestone") return { parent: "專案", main: "里程碑" };
  if (budgetType === "task") return { parent: "里程碑", main: "任務" };
  return { parent: "", main: "" };
}

export default function BudgetInput(props: Props) {
  const {
    value,
    onBudgetChange,
    budgetType,
    totalBudget,
    errorMsg,
    remainingBudget,
    originalBudget = 0,
    isEditing = false,
    minBudget = 0, // 預設最低預算為0
  } = props;
  const [sliderMax, setSliderMax] = useState(0);
  const [sliderMin, setSliderMin] = useState(0);
  useEffect(() => {
    setSliderMax(remainingBudget+originalBudget);
    setSliderMin(minBudget);
  }, [totalBudget, minBudget]);
  // 計算實際可用預算（在編輯模式下，加上原有預算）
  const effectiveRemainingBudget = isEditing
    ? remainingBudget + originalBudget
    : remainingBudget;

  // 計算實際可用預算的百分比
  const effectiveRemainingBudgetPercent =
    (effectiveRemainingBudget / totalBudget) * 100;
  const budgetText = getBudgetText(budgetType);

  // 檢查當前輸入是否超過可用預算
  const currentBudget = Number(value || 0);
  const budgetExceeded = isEditing
    ? currentBudget - originalBudget > remainingBudget
    : currentBudget > remainingBudget;

  // 檢查是否低於最低預算
  const belowMinBudget = currentBudget < minBudget;

  // 滑桿狀態管理
  const [sliderValue, setSliderValue] = useState<number>(
    currentBudget > 0 ? currentBudget : minBudget,
  );

  // 當輸入改變時更新滑桿
  useEffect(() => {
       setSliderValue(currentBudget);
  }, [currentBudget]);

  const beforeBudgetChange = (input: string) => {
    // 只保留數字
    const numericValue = input.replace(/[^0-9]/g, "");
    onBudgetChange(numericValue);
  };

  const handleBudgetButtonClick = (budget: number) => {
    const budgetStr = Math.round(budget).toString();
    beforeBudgetChange(budgetStr);
  };

  // 滑桿變更處理
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const budget = Math.round(newValue as number);
    setSliderValue(budget);
  };

  // 滑桿釋放處理
  const handleSliderChangeCommitted = (
    _event: React.SyntheticEvent | Event,
    newValue: number | number[],
  ) => {
    const budget = Math.round(newValue as number);
    handleBudgetButtonClick(budget);
  };

  const hasInsufficientBudget = effectiveRemainingBudgetPercent <= 0;

  return (
    <Fragment>
      {/* 添加左上角標題 */}
      <Box
        sx={{
          mb: 0.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color={theme.text.primary}
          fontSize="15px"
        >
          預算
        </Typography>
      </Box>
      {/* 顯示錯誤訊息 */}
      {errorMsg && (
        <Box sx={{ mb: 1 }}>
          <Typography color={theme.error.primary} fontSize="14px">
            {errorMsg}
          </Typography>
        </Box>
      )}
      {/* 條件提示訊息 */}
      {(budgetExceeded || belowMinBudget) && !errorMsg && (
        <Box sx={{ mb: 0.5 }}>
          {budgetExceeded && (
            <Typography
              color={theme.error.primary}
              fontSize="14px"
              fontWeight="bold"
            >
              注意：預算已超出可用額度
            </Typography>
          )}
          {belowMinBudget && !budgetExceeded && (
            <Typography color={WARNING_COLOR} fontSize="14px" fontWeight="bold">
              注意：預算低於最低建議額度 ({minBudget} 元)
            </Typography>
          )}
        </Box>
      )}
      <div style={{ height: "3px" }} />
      {/* 預算調整器 */}
      {/* 滑桿頂部標籤 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleBudgetButtonClick(sliderMin)}
            sx={{
              backgroundColor: belowMinBudget
                ? WARNING_COLOR
                : theme.colors.BN100,
              color: belowMinBudget ? theme.neutralWhite : theme.text.secondary,
              "&:hover": {
                backgroundColor: belowMinBudget
                  ? WARNING_COLOR
                  : theme.colors.BN200,
                opacity: 0.9,
              },
              boxShadow: belowMinBudget
                ? "0 2px 6px rgba(255,165,0,0.3)"
                : "none",
              borderRadius: "20px",
              fontSize: "12px",
              padding: "3px 10px",
              minWidth: "unset",
              fontWeight: "bold",
              transition: "all 0.2s ease",
            }}
          >
            最低: {sliderMin} 元
          </Button>
        </Box>

        {/* 中央預算輸入框 */}
        <InputWithLabelV2
          type="text"
          value={value}
          onChange={(e) => beforeBudgetChange(e.target.value)}
        />
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            right: "10px",
            color: theme.text.secondary,
            fontSize: "13px",
            pointerEvents: "none",
          }}
        >
          
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            size="small"
            disabled={hasInsufficientBudget}
            onClick={() =>
              handleBudgetButtonClick(sliderMax)
            }
            sx={{
              backgroundColor: hasInsufficientBudget
                ? theme.colors.BN100
                : theme.brand.primary,
              color: hasInsufficientBudget
                ? theme.text.secondary
                : theme.neutralWhite,
              "&:hover": {
                backgroundColor: hasInsufficientBudget
                  ? theme.colors.BN100
                  : theme.brand.primary,
                opacity: 0.9,
              },
              boxShadow: hasInsufficientBudget
                ? "none"
                : "0 2px 6px rgba(25,118,210,0.3)",
              borderRadius: "20px",
              fontSize: "12px",
              padding: "3px 10px",
              minWidth: "unset",
              fontWeight: "bold",
              transition: "all 0.2s ease",
            }}
          >
            最大: {sliderMax} 元
          </Button>
        </Box>
      </Box>
      {/* 滑桿 */}
      <Slider
        value={sliderValue}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderChangeCommitted}
        min={sliderMin}
        max={sliderMax}
        step={1}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${Math.round(value)} 元`}
        sx={{
          mt: 2,
          mb: 1,
          color: budgetExceeded
            ? theme.error.primary
            : belowMinBudget
              ? WARNING_COLOR
              : theme.brand.primary,
          "& .MuiSlider-thumb": {
            height: 28,
            width: 28,
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            border: budgetExceeded
              ? `2px solid ${theme.error.primary}`
              : belowMinBudget
                ? `2px solid ${WARNING_COLOR}`
                : `2px solid ${theme.brand.primary}`,
            "&:focus, &:hover, &.Mui-active": {
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            },
            "&:before": {
              display: "none",
            },
            transition: "all 0.2s ease",
          },
          "& .MuiSlider-track": {
            border: "none",
            height: 10,
            borderRadius: 5,
          },
          "& .MuiSlider-rail": {
            height: 10,
            borderRadius: 5,
            opacity: 0.3,
            backgroundColor: theme.colors.BN100,
          },
          "& .MuiSlider-valueLabel": {
            backgroundColor: theme.neutralWhite,
            color: theme.text.primary,
            fontSize: "13px",
            fontWeight: "bold",
            padding: "4px 10px",
            borderRadius: "6px",
            border: `1px solid ${theme.border.primary}`,
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            "&:before": {
              display: "none",
            },
            top: -8,
            "& *": {
              background: "transparent",
            },
          },
          transition: "all 0.2s ease",
        }}
      />{" "}
      <BudgetTips
        totalBudget={totalBudget}
        totalBudgetText={budgetText.parent}
        remainingBudget={sliderMax-originalBudget}
        remainingBudgetPercent={((sliderMax-originalBudget) / totalBudget) * 100}
        effectiveRemainingBudget={effectiveRemainingBudget}
        effectiveRemainingBudgetPercent={effectiveRemainingBudgetPercent}
        isEditing={isEditing}
        originalBudget={originalBudget}
        budgetExceeded={budgetExceeded}
        currentBudget={currentBudget}
        minBudget={minBudget}
        belowMinBudget={belowMinBudget}
      />
    </Fragment>
  );
}
