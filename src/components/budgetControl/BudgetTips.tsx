import InfoIcon from "@mui/icons-material/Info";
import { Box, Typography, Chip } from "@mui/material";
import { theme } from "@shared/utils/theme";

// 預設橙色警告顏色
const WARNING_COLOR = "#FFA500";
const WARNING_BG_COLOR = "rgba(255, 165, 0, 0.1)";

interface Props {
  totalBudget: number;
  totalBudgetText: string;
  remainingBudget: number;
  remainingBudgetPercent: number;
  effectiveRemainingBudget?: number;
  effectiveRemainingBudgetPercent?: number;
  isEditing?: boolean;
  originalBudget?: number;
  budgetExceeded?: boolean;
  currentBudget?: number;
  minBudget?: number;
  belowMinBudget?: boolean;
}

export default function BudgetTips(props: Props) {
  const {
    totalBudget,
    remainingBudget,
    remainingBudgetPercent,
    isEditing = false,
    originalBudget = 0,
    budgetExceeded = false,
    currentBudget = 0,
    minBudget = 0,
    belowMinBudget = false,
  } = props;

  // 計算超出金額
  const exceededAmount = isEditing
    ? currentBudget - originalBudget - remainingBudget
    : currentBudget - remainingBudget;

  // 計算低於最低預算的差額
  const belowMinAmount = minBudget - currentBudget;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        color: theme.colors.BN300,
        backgroundColor: theme.colors.GN25,
        borderRadius: "4px",
        padding: "8px 12px",
      }}
    >
      {/* 所有預算信息在同一行 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        <InfoIcon sx={{ fontSize: "18px", color: theme.colors.BN300 }} />

        <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
          <Typography sx={{ fontSize: "12px", mr: 0.5 }}>總預算:</Typography>
          <Chip
            label={`${totalBudget} 元`}
            size="small"
            sx={{
              height: "20px",
              fontSize: "12px",
              backgroundColor: theme.colors.BN50,
              fontWeight: "bold",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
          <Typography sx={{ fontSize: "12px", mr: 0.5 }}>剩餘預算:</Typography>
          <Chip
            label={`${remainingBudget} 元 (${remainingBudgetPercent.toFixed(1)}%)`}
            size="small"
            sx={{
              height: "20px",
              fontSize: "12px",
              backgroundColor:
                remainingBudget <= 0 ? "#FFEAEA" : theme.colors.BN50,
              color: remainingBudget <= 0 ? theme.error.primary : "inherit",
              fontWeight: "bold",
            }}
          />
        </Box>

        {minBudget > 0 && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ fontSize: "12px", mr: 0.5 }}>
              最低要求:
            </Typography>
            <Chip
              label={`${minBudget} 元`}
              size="small"
              sx={{
                height: "20px",
                fontSize: "12px",
                backgroundColor: belowMinBudget
                  ? WARNING_BG_COLOR
                  : theme.colors.BN50,
                color: belowMinBudget ? WARNING_COLOR : "inherit",
                fontWeight: "bold",
              }}
            />
          </Box>
        )}
      </Box>

      {/* 警告信息區域 */}
      {(budgetExceeded || (belowMinBudget && minBudget > 0)) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: budgetExceeded
              ? theme.error.light
              : WARNING_BG_COLOR,
            borderRadius: "4px",
            padding: "4px 8px",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "bold",
              color: budgetExceeded ? theme.error.primary : WARNING_COLOR,
            }}
          >
            {budgetExceeded
              ? `警告: 超出可用預算 ${exceededAmount.toFixed(1)} 元`
              : `警告: 低於最低預算 ${belowMinAmount.toFixed(1)} 元`}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
