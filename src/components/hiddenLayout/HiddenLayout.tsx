import { CSSProperties, ReactNode } from "react"

interface Props {
  children: ReactNode
  invisible?: boolean
}

export default function HiddenLayout(props: Props) {
  const style: CSSProperties = props.invisible
    ? { visibility: "hidden" } // Will not change the layout
    : { display: "none" } // Will change the layout

  return <div style={style}>{props.children}</div>
}
