import CloseIcon from "@mui/icons-material/Close";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import { IconButton } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { theme } from "@shared/utils/theme";
import { TimerInfo, Coordinate } from "@shared/utils/types";
import {
  TIMER_PADDING_BOTTOM,
  TIMER_PADDING_LEFT,
  TIMER_PADDING_RIGHT,
} from "@shared/utils/utils";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  info: TimerInfo;
  onTimerClose: VoidFunction;
}

const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

function getScrollOffset(timerOffset: Coordinate) {
  let newX = timerOffset.x;
  let newY = timerOffset.y;
  if (window.scrollX === 0) newX = 0;
  if (window.scrollY === 0) newY = 0;

  return { x: newX, y: newY };
}

export default function Timer(props: Props) {
  const { info, onTimerClose } = props;
  const [position, setPosition] = useState<Coordinate>(info.position);
  const [scrollOffset, setScrollOffset] = useState<Coordinate>(
    getScrollOffset(info.scrollOffset),
  );

  const [isDragging, setIsDragging] = useState(false);
  const now = dayjs();
  const [time, setTime] = useState(now.diff(info.startTime, "second"));
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let x = info.position.x;
    let y = info.position.y;

    if (x > viewportWidth - TIMER_PADDING_RIGHT) {
      x = viewportWidth - TIMER_PADDING_RIGHT;
    }

    if (y > viewportHeight - TIMER_PADDING_BOTTOM) {
      y = viewportHeight - TIMER_PADDING_BOTTOM;
    }

    setPosition({ x, y });
  }, [info]);

  // save final position
  useEffect(() => {
    if (isDragging) return;

    const timerInfo: TimerInfo = {
      id: info.id,
      name: info.name,
      position,
      scrollOffset,
      milestone: info.milestone,
      task: info.task,
      startTime: info.startTime,
      project: info.project,
    };
    localStorage.setItem("timerInfo", JSON.stringify(timerInfo));
  }, [isDragging, info, position, scrollOffset]);

  const formatTime = useMemo(() => {
    const hours = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;

    return {
      hours: hours < 10 ? `0${hours}` : hours,
      mins: mins < 10 ? `0${mins}` : mins,
      secs: secs < 10 ? `0${secs}` : secs,
    };
  }, [time]);

  const constrainPosition = (x: number, y: number) => {
    let newX = x;
    let newY = y;

    if (x < TIMER_PADDING_LEFT) newX = TIMER_PADDING_LEFT;
    if (x > viewportWidth - TIMER_PADDING_RIGHT)
      newX = viewportWidth - TIMER_PADDING_RIGHT;
    if (y < 0) newY = 0;
    if (y > viewportHeight - TIMER_PADDING_BOTTOM)
      newY = viewportHeight - TIMER_PADDING_BOTTOM;

    return { x: newX, y: newY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    // Calculate offset between mouse position and element position
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newPosition = constrainPosition(
      e.clientX - dragOffset.current.x,
      e.clientY - dragOffset.current.y,
    );

    setPosition(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScroll = () => {
    setScrollOffset({ x: window.scrollX, y: window.scrollY });
  };

  const handleResize = () => {
    const newViewportWidth = window.innerWidth;
    const newViewportHeight = window.innerHeight;

    setPosition((prev) => {
      const x = Math.min(prev.x, newViewportWidth - TIMER_PADDING_RIGHT);
      const y = Math.min(prev.y, newViewportHeight - TIMER_PADDING_BOTTOM);

      return { x, y };
    });
  };

  // Add and remove event listeners
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDragging]);

  return (
    <Box
      sx={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        top: position.y + scrollOffset.y,
        left: position.x + scrollOffset.x,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      <Box
        sx={{
          aspectRatio: 1,
          width: "max-content",
          backgroundColor: theme.colors.kellyGreen,
          opacity: 0.8,
          border: `2px solid ${theme.text.primary}`,
          borderRadius: "50%",
          color: theme.neutralWhite,
          position: "relative",
          pt: "8px",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            p: "3px",
            right: -4,
            top: 0,
            backgroundColor: theme.text.primary,
            borderRadius: "50%",
          }}
          onClick={onTimerClose}
        >
          <CloseIcon sx={{ fontSize: "20px", color: theme.neutralWhite }} />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: "4px",
            mb: "16px",
            alignItems: "center",
          }}
        >
          <TimerOutlinedIcon style={{ width: "40px", height: "40px" }} />
          <Typography sx={{ fontSize: "18px", px: "4px" }}>
            {formatTime.hours}:{formatTime.mins}:{formatTime.secs}
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          width: "130px",
          backgroundColor: theme.neutralWhite,
          borderRadius: "100px",
          color: theme.text.primary,
          position: "absolute",
          px: "4px",
          fontSize: "16px",
          bottom: "-4px",
          boxShadow: `2px 0px 2px 0px ${theme.colors.BN100}`,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {info.name}
      </Typography>
    </Box>
  );
}
