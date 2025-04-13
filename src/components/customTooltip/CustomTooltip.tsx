import { Tooltip } from "@mui/material"
import { ReactNode, useMemo } from "react"

export type ToolTipType = "noPermission" | "subtaskUnfinished" | "overBudget"
interface Props {
  show: boolean
  children: ReactNode
  type?: ToolTipType
}

export default function CustomTooltip(props: Props) {
  const { children, show, type } = props

  const title = useMemo(() => {
    switch (type) {
      case "subtaskUnfinished":
        return "前一個動作尚未完成"
      case "noPermission":
        return "權限不足"
      case "overBudget":
        return "預算不足"
      default:
        return ""
    }
  }, [type])

  return (
    <Tooltip arrow followCursor title={show ? title : ""}>
      <span>{children}</span>
    </Tooltip>
  )
}
