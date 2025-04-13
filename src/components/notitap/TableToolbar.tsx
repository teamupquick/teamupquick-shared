import { Editor } from "@tiptap/react";
import {
  RiAddCircleLine,
  RiDeleteBin2Line,
  RiInsertColumnRight,
  RiInsertColumnLeft,
  RiInsertRowTop,
  RiInsertRowBottom,
  RiDeleteColumn,
  RiDeleteRow,
  RiMergeCellsHorizontal,
  RiSplitCellsHorizontal,
} from "react-icons/ri";
import { ToolbarButton } from "./ToolbarButton";
import "./TableToolbar.css";
import { useEffect, useRef } from "react";

interface TableToolbarProps {
  editor: Editor;
  position: { top: number; left: number };
}

export const TableToolbar = ({ editor, position }: TableToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);

  // 更新工具欄位置以跟隨表格
  useEffect(() => {
    if (!toolbarRef.current) return;

    // 獲取表格元素
    const editorRoot = document.querySelector(".ProseMirror") as HTMLElement;
    if (!editorRoot) return;

    const tableElement = editorRoot.querySelector("table") as HTMLElement;
    if (!tableElement) return;

    // 設置初始位置
    updateToolbarPosition();

    // 監聽滾動事件來更新位置
    window.addEventListener("scroll", updateToolbarPosition);
    editorRoot.addEventListener("scroll", updateToolbarPosition);

    // 定期更新位置，以防其他DOM變化
    const intervalId = setInterval(updateToolbarPosition, 500);

    function updateToolbarPosition() {
      if (!tableElement || !toolbarRef.current) return;

      const tableRect = tableElement.getBoundingClientRect();

      // 檢查表格是否在視口中
      if (
        tableRect.bottom < 0 ||
        tableRect.top > window.innerHeight ||
        tableRect.right < 0 ||
        tableRect.left > window.innerWidth
      ) {
        // 表格不在視口中，隱藏工具欄
        toolbarRef.current.style.display = "none";
        return;
      }

      // 表格在視口中，顯示工具欄
      toolbarRef.current.style.display = "flex";

      // 計算絕對位置
      toolbarRef.current.style.top = `${tableRect.top - 85}px`;
      toolbarRef.current.style.left = `${tableRect.left - 50}px`;

      // 如果工具欄會超出頂部，則顯示在表格下方
      if (tableRect.top < 150) {
        toolbarRef.current.style.top = `${tableRect.bottom - 20}px`;
      }
    }

    return () => {
      window.removeEventListener("scroll", updateToolbarPosition);
      editorRoot.removeEventListener("scroll", updateToolbarPosition);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div ref={toolbarRef} className="table-toolbar">
      <div className="toolbar-group">
        <ToolbarButton
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          isActive={false}
          icon={RiInsertColumnLeft}
          title="在左側添加欄位"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          isActive={false}
          icon={RiInsertColumnRight}
          title="在右側添加欄位"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().deleteColumn().run()}
          isActive={false}
          icon={RiDeleteColumn}
          title="刪除欄位"
        />
      </div>

      <div className="divider" />

      <div className="toolbar-group">
        <ToolbarButton
          onClick={() => editor.chain().focus().addRowBefore().run()}
          isActive={false}
          icon={RiInsertRowTop}
          title="在上方添加行"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().addRowAfter().run()}
          isActive={false}
          icon={RiInsertRowBottom}
          title="在下方添加行"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().deleteRow().run()}
          isActive={false}
          icon={RiDeleteRow}
          title="刪除行"
        />
      </div>

      <div className="divider" />

      <div className="toolbar-group">
        <ToolbarButton
          onClick={() => editor.chain().focus().mergeCells().run()}
          isActive={false}
          icon={RiMergeCellsHorizontal}
          title="合併單元格"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().splitCell().run()}
          isActive={false}
          icon={RiSplitCellsHorizontal}
          title="拆分單元格"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().deleteTable().run()}
          isActive={false}
          icon={RiDeleteBin2Line}
          title="刪除表格"
        />
      </div>
    </div>
  );
};
