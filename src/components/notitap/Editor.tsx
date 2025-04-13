import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "./extensions";
import { MenuBar } from "./MenuBar";
import "./Editor.css";
import { TableToolbar } from "./TableToolbar";

interface EditorProps {
  content?: string;
  onUpdate?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export const Editor = ({
  content = "",
  onUpdate,
  placeholder = "開始輸入...",
  readOnly = false,
}: EditorProps) => {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLElement | null>(null);
  const [showTableToolbar, setShowTableToolbar] = useState(false);
  const [tablePosition, setTablePosition] = useState({ top: 0, left: 0 });
  const editorUpdatedRef = useRef<boolean>(false); // 追蹤編輯器更新狀態


  const editor = useEditor({
    extensions,
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      // 標記編輯器已更新
      editorUpdatedRef.current = true;
      // 使用setTimeout來確保不會中斷輸入
      setTimeout(() => {
        if (onUpdate) {
          const html = editor.getHTML();
          onUpdate(html);
        }
        // 重設更新標記
        editorUpdatedRef.current = false;
      }, 100);
    },
    editorProps: {
      attributes: {
        class: "notitap-editor",
        placeholder,
      },
      // 改進focus處理
      handleDOMEvents: {
        focus: (view, event) => {
          // 如果編輯器正在更新中，阻止默認焦點行為
          if (editorUpdatedRef.current) {
            event.preventDefault();
            return true;
          }
          return false;
        },
      },
    },
  });

  // 當 content prop 更新時，更新編輯器內容
  useEffect(() => {
    if (editor && content) {

      // 只有當編輯器內容與 prop 不同時才更新
      const currentContent = editor.getHTML();
      if (currentContent !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  useEffect(() => {
    if (editor) {
      setIsReady(true);
    }
  }, [editor]);

  // 檢測是否選中了表格，顯示表格工具欄
  useEffect(() => {
    if (!editor) return;

    const checkTableSelection = () => {
      const isInTable = editor.isActive("table");
      setShowTableToolbar(isInTable);
    };

    // 立即檢查一次
    checkTableSelection();

    // 監聽多個事件以確保工具欄顯示
    editor.on("selectionUpdate", checkTableSelection);
    editor.on("focus", checkTableSelection);
    editor.on("transaction", checkTableSelection);
    editor.on("update", checkTableSelection);

    return () => {
      editor.off("selectionUpdate", checkTableSelection);
      editor.off("focus", checkTableSelection);
      editor.off("transaction", checkTableSelection);
      editor.off("update", checkTableSelection);
    };
  }, [editor]);

  useEffect(() => {
    if (!containerRef.current || !editor) return;

    // 添加圖片點擊事件監聽器
    const handleImageClick = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      const target = event.target as HTMLElement;

      // 清除目前選中的圖片
      if (selectedImage) {
        selectedImage.classList.remove("selected");
      }

      // 檢查點擊的是否為圖片 (包括 IMG 標籤和有 resizable-image 類的元素)
      if (
        target.tagName === "IMG" ||
        target.classList.contains("resizable-image")
      ) {
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();

        // 設置編輯器焦點
        editor.commands.focus();

        // 處理圖片元素
        const imageElement = target;
        imageElement.classList.add("selected");

        // 檢查圖片節點屬性
        try {
          if (editor.isActive("image")) {
            const { state } = editor.view;
            const pos = state.selection.from;
            const node = state.doc.nodeAt(pos);
          }
        } catch (error) {
          console.error("讀取圖片節點屬性出錯:", error);
        }

        setSelectedImage(imageElement);
      } else {
        // 如果點擊的不是圖片，清除選擇
        setSelectedImage(null);
      }
    };

    // 註冊點擊事件
    const editorContent = containerRef.current.querySelector(".ProseMirror");
    if (editorContent) {
      editorContent.addEventListener("click", handleImageClick);
    }

    return () => {
      const editorContent = containerRef.current?.querySelector(".ProseMirror");
      if (editorContent) {
        editorContent.removeEventListener("click", handleImageClick);
      }
    };
  }, [editor, selectedImage]);

  // 新增： 防止外部事件干擾文字輸入
  useEffect(() => {
    const preventFocusLoss = (e: MouseEvent) => {
      // 如果點擊事件發生在編輯器容器之外，但編輯器正處於輸入狀態
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        editor?.isFocused &&
        editorUpdatedRef.current
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      return true;
    };

    document.addEventListener("mousedown", preventFocusLoss, true);

    return () => {
      document.removeEventListener("mousedown", preventFocusLoss, true);
    };
  }, [editor]);

  if (!isReady || !editor) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`editor-container ${readOnly ? "readonly" : ""}`}
    >
      {!readOnly && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
      {showTableToolbar && editor && !readOnly && (
        <TableToolbar editor={editor} position={tablePosition} />
      )}
      {!readOnly && (
        <div className="character-count">
          {editor.storage.characterCount.characters()} 字
        </div>
      )}
    </div>
  );
};
