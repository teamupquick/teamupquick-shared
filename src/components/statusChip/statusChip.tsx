import { Chip } from "@mui/material";
import { Status } from "@shared/utils/types";
import {
  getStatusColor,
  getStatusLabel,
  STATUS_LABEL_COLORS,
} from "@shared/utils/constants";

interface Props {
  status: Status;
}

export default function StatusChip({ status }: Props) {
  return (
    <Chip
      label={getStatusLabel(status)}
      sx={{
        background: getStatusColor(status),
        color: STATUS_LABEL_COLORS[status] || "#000000",
        fontWeight: 700,
      }}
    />
  );
}
