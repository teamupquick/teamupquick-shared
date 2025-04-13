import DateRangeIcon from "@mui/icons-material/DateRange"
import { Box, ClickAwayListener, IconButton, Typography } from "@mui/material"
import { theme } from "@shared/utils/theme"
import { addDays, format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { useMemo, useState } from "react"
import { RangeKeyDict, Range, DateRange } from "react-date-range"
import "react-date-range/dist/styles.css" // main css file
import "react-date-range/dist/theme/default.css" // theme css file

interface Props {
  range: Range
  onDateChange: (rangesByKey: RangeKeyDict) => void
  calendarPosition?: "top" | "right" | "bottom" | "left"
}

export default function CalendarWithIcon({
  range,
  onDateChange,
  calendarPosition,
}: Props) {
  const [open, setOpen] = useState(false)

  const calendarStyle = useMemo(() => {
    if (calendarPosition === "top") return { bottom: "40px" }
    return { top: "-36px", right: "-357px" }
  }, [calendarPosition])

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: `1px solid ${theme.border.primary}`,
          width: "376px",
          borderRadius: "8px",
          padding: "0px 12px",
          "&:hover": {
            cursor: "pointer",
            borderColor: theme.border.secondary,
          },
        }}
      >
        <Typography color={theme.colors.GN40}>
          {range.startDate && format(range.startDate, "yyyy/MM/dd")}
          {" ~ "}
          {range.endDate && format(range.endDate, "yyyy/MM/dd")}
        </Typography>
        <IconButton onClick={() => setOpen(!open)}>
          <DateRangeIcon />
        </IconButton>
        {open && (
          <Box
            height="400px"
            overflow="hidden"
            position="absolute"
            {...calendarStyle}
          >
            <DateRange
              locale={zhTW}
              onChange={onDateChange}
              months={12}
              minDate={addDays(new Date(), -1)}
              direction="vertical"
              scroll={{ enabled: true }}
              ranges={[range]}
            />
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  )
}
