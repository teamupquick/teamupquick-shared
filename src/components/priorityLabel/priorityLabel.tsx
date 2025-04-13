import { Chip, Typography } from "@mui/material";
import { Priority } from "@shared/utils/types";
import {
  getPriorityColor,
  getPriorityLabel,
  PRIORITY_LABEL_COLORS,
} from "@shared/utils/constants";

interface Props {
  priority: Priority;
}

export default function PriorityLabel({ priority }: Props) {
  return (
    <Chip
      label={getPriorityLabel(priority)}
      sx={{
        backgroundColor: getPriorityColor(priority),
        color: PRIORITY_LABEL_COLORS[priority] || "#000000",
        fontSize: "12px",
        height: "24px",
        fontWeight: 500,
      }}
    />
  );
}
