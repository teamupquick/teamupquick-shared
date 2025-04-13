import { Box, IconButton } from "@mui/material";
import IconMilestone from "@shared-assets/icons/icon_milestone.svg?react";
import IconTask from "@shared-assets/icons/icon_task.svg?react";
import IconSubtask from "@shared-assets/icons/icon_subtask.svg?react";
import IconDots from "@shared-assets/icons/icon_dots.svg?react";
import IconChevrons from "@shared-assets/icons/icon_chevrons.svg?react";
import { theme } from "@shared/utils/theme";
import { MouseEvent, useState } from "react";

interface Props {
  type: "project" | "milestone" | "task" | "subtask";
  label: string;
  onCollapse?: VoidFunction;
  onMenuClick?: (e: MouseEvent<HTMLElement>) => void;
  collapse?: boolean;
}

const ICON_MAPPING = {
  project: <></>,
  milestone: <IconMilestone />,
  task: <IconTask />,
  subtask: <IconSubtask />,
};

const CONTAINER_SX = {
  background: theme.colors.GN50,
  padding: "8px",
  borderRadius: "4px",
  height: "40px",
};

export default function TableIconLabel({
  type,
  label,
  onCollapse,
  onMenuClick,
  collapse,
}: Props) {
  return (
    <Box display="flex">
      {onCollapse && (
        <IconButton onClick={onCollapse}>
          <IconChevrons
            style={{
              rotate: collapse ? "0deg" : "-90deg",
            }}
          />
        </IconButton>
      )}
      <Box
        display="flex"
        alignItems="center"
        sx={type === "subtask" ? undefined : CONTAINER_SX}
      >
        {ICON_MAPPING[type]}
        <div style={{ width: "4px" }} />
        {label}
      </Box>
      {onMenuClick && (
        <>
          <div style={{ flex: 1 }} />
          <IconButton onClick={onMenuClick}>
            <IconDots />
          </IconButton>
        </>
      )}
    </Box>
  );
}
