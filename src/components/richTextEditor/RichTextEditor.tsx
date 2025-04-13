import type { FC} from "react";
import { useCallback, useMemo } from "react"

import { Editable, withReact, useSlate, Slate } from "slate-react"
import type {
  Node} from "slate";
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement
} from "slate"
import { withHistory } from "slate-history"
import { Box, Button } from "@mui/material"
import { theme } from "@shared/utils/theme"
import FormatBoldIcon from "@mui/icons-material/FormatBold"
import FormatItalicIcon from "@mui/icons-material/FormatItalic"
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined"
import CodeIcon from "@mui/icons-material/Code"
import LooksOneIcon from "@mui/icons-material/LooksOne"
import LooksTwoIcon from "@mui/icons-material/LooksTwo"
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered"
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft"
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter"
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight"

const LIST_TYPES = ["numbered-list", "bulleted-list"]
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"]

interface Props {
  // TODO: Figure out why Descendant is not working
  initialValue: any[]
  onValueChange: (value: any[]) => void
}

// BUGFIX: initialValue won't update editor in edit mode
const RichText = ({ initialValue, onValueChange }: Props) => {
  const renderElement = useCallback((props: any) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onValueChange={onValueChange}
      key={JSON.stringify(initialValue)}
    >
      <Box>
        <MarkButton format="bold" icon={<FormatBoldIcon />} />
        <MarkButton format="italic" icon={<FormatItalicIcon />} />
        <MarkButton format="underline" icon={<FormatUnderlinedIcon />} />
        <MarkButton format="code" icon={<CodeIcon />} />
        <BlockButton format="heading-one" icon={<LooksOneIcon />} />
        <BlockButton format="heading-two" icon={<LooksTwoIcon />} />
        <BlockButton format="block-quote" icon={<FormatQuoteIcon />} />
        <BlockButton format="numbered-list" icon={<FormatListNumberedIcon />} />
        <BlockButton format="bulleted-list" icon={<FormatListBulletedIcon />} />
        <BlockButton format="left" icon={<FormatAlignLeftIcon />} />
        <BlockButton format="center" icon={<FormatAlignCenterIcon />} />
        <BlockButton format="right" icon={<FormatAlignRightIcon />} />
        <BlockButton format="justify" icon={<FormatAlignRightIcon />} />
      </Box>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        style={{
          padding: "0px 8px",
          border: `solid 1px ${theme.colors.BN50}`,
          borderRadius: "4px",
        }}
      />
    </Slate>
  )
}

const toggleBlock = (editor: any, format: any) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as any).type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: any
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor: any, format: any) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: any, format: any, blockType = "type") => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: Node) => {
        const key = blockType as keyof Node
        const currentFormat = n[key]
        return (
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          currentFormat === format
        )
      },
    }),
  )

  return !!match
}

const isMarkActive = (editor: Editor, format: any) => {
  const marks = Editor.marks(editor)
  const key = format as keyof typeof marks
  return marks ? marks[key] === true : false
}

const Element: FC<{ attributes: any; children: any; element: any }> = ({
  attributes,
  children,
  element,
}) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf: FC<{ attributes: any; children: any; leaf: any }> = ({
  attributes,
  children,
  leaf,
}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton: FC<any> = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      sx={{
        minWidth: "40px",
        color: isBlockActive(editor, format) ? "#000000" : "#000000",
        background: "transparent",
      }}
      size="small"
      variant={
        isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
        )
          ? "contained"
          : "text"
      }
      onMouseDown={(event: any) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {icon}
    </Button>
  )
}

const MarkButton: FC<any> = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      sx={{
        minWidth: "42px",
        color: isMarkActive(editor, format) ? "#FFFFFF" : "#000000",
      }}
      size="small"
      variant={isMarkActive(editor, format) ? "contained" : "text"}
      onMouseDown={(event: any) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      {icon}
    </Button>
  )
}

export default RichText
