import type { Editor } from "@tiptap/react";
import {
  RiBold,
  RiItalic,
  RiUnderline,
  RiStrikethrough,
  RiH1,
  RiH2,
  RiH3,
  RiListUnordered,
  RiListOrdered,
  RiCodeBoxLine,
  RiLink,
  RiImage2Line,
  RiTable2,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
  RiListCheck2,
  RiSubscript,
  RiSuperscript,
  RiFontSize,
  RiPaintFill,
  RiMoreLine,
  RiFormatClear,
  RiHeading,
  RiParagraph,
  RiAlignVertically,
  RiInsertColumnRight,
  RiFontColor,
} from "react-icons/ri";
import { ToolbarButton } from "./ToolbarButton";
import "./MenuBar.css";
import { useState, useRef, useEffect } from "react";
import React from "react";

interface MenuBarProps {
  editor: Editor;
}

export const MenuBar = ({ editor }: MenuBarProps) => {
  const [showFormattingMenu, setShowFormattingMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showImageSizeMenu, setShowImageSizeMenu] = useState(false);
  const [imageSize, setImageSize] = useState(100);

  const formattingMenuRef = useRef<HTMLDivElement>(null);
  const alignMenuRef = useRef<HTMLDivElement>(null);
  const headingMenuRef = useRef<HTMLDivElement>(null);
  const insertMenuRef = useRef<HTMLDivElement>(null);
  const fontSizeMenuRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);
  const imageSizeMenuRef = useRef<HTMLDivElement>(null);

  // 獲取選中的圖片節點
  const getSelectedImage = (): HTMLElement | null => {
    if (!editor) return null;

    try {
      // 先檢查編輯器 DOM 中是否有被選中的圖片
      const editorDOM = editor.view.dom as HTMLElement;
      const selectedImages = editorDOM.querySelectorAll(
        "img.selected, .resizable-image.selected",
      );

      if (selectedImages.length > 0) {
        return selectedImages[0] as HTMLElement;
      }

      // 如果沒找到被選中的圖片，嘗試使用 editor 的 API 獲取當前選中的節點
      if (editor.isActive("image")) {
        const { state } = editor.view;
        const pos = state.selection.from;
        const node = state.doc.nodeAt(pos);

        if (node && node.type.name === "image") {
          // 找到對應的 DOM 元素
          return editor.view.nodeDOM(pos) as HTMLElement;
        }
      }
    } catch (error) {
      console.error("獲取選中圖片出錯:", error);
    }

    return null;
  };

  // 應用圖片變更到模型中
  const applyImageChanges = () => {
    if (!editor) return;

    const selectedImage = getSelectedImage();
    if (selectedImage && editor.isActive("image")) {
      try {
        // 取得當前選中的圖片節點
        const { state } = editor.view;
        const pos = state.selection.from;
        const node = state.doc.nodeAt(pos);

        if (node && node.type.name === "image") {
          // 只更新寬度
          const updateAttrs: Record<string, any> = {
            width: `${imageSize}%`,
          };

          // 更新圖片節點的屬性
          editor.chain().focus().updateAttributes("image", updateAttrs).run();
        }
      } catch (error) {
        console.error("更新圖片屬性時出錯:", error);
      }
    }
  };

  // 點擊外部時關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formattingMenuRef.current &&
        !formattingMenuRef.current.contains(event.target as Node)
      ) {
        setShowFormattingMenu(false);
      }
      if (
        alignMenuRef.current &&
        !alignMenuRef.current.contains(event.target as Node)
      ) {
        setShowAlignMenu(false);
      }
      if (
        headingMenuRef.current &&
        !headingMenuRef.current.contains(event.target as Node)
      ) {
        setShowHeadingMenu(false);
      }
      if (
        insertMenuRef.current &&
        !insertMenuRef.current.contains(event.target as Node)
      ) {
        setShowInsertMenu(false);
      }
      if (
        fontSizeMenuRef.current &&
        !fontSizeMenuRef.current.contains(event.target as Node)
      ) {
        setShowFontSizeMenu(false);
      }
      if (
        colorMenuRef.current &&
        !colorMenuRef.current.contains(event.target as Node)
      ) {
        setShowColorMenu(false);
      }
      if (
        imageSizeMenuRef.current &&
        !imageSizeMenuRef.current.contains(event.target as Node) &&
        showImageSizeMenu
      ) {
        // 在關閉圖片設定選單前先保存更改
        applyImageChanges();

        setShowImageSizeMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showImageSizeMenu, editor, imageSize]);

  if (!editor) {
    return null;
  }

  const fontSizes = [
    { label: "小", size: "12px", class: "text-xs" },
    { label: "正常", size: "16px", class: "text-base" },
    { label: "中", size: "18px", class: "text-lg" },
    { label: "大", size: "24px", class: "text-2xl" },
    { label: "特大", size: "32px", class: "text-3xl" },
  ];

  const colors = [
    { label: "黑色", value: "#000000" },
    { label: "灰色", value: "#666666" },
    { label: "紅色", value: "#ff0000" },
    { label: "綠色", value: "#00ff00" },
    { label: "藍色", value: "#0000ff" },
  ];

  const addImage = () => {
    const url = window.prompt("圖片網址");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt("連結網址");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  // 防止冒泡和默認行為
  const preventDefault = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 處理圖片大小調整
  const handleImageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setImageSize(newSize);

    const selectedImage = getSelectedImage();
    if (selectedImage) {
      selectedImage.style.width = `${newSize}%`;
    }
  };

  // 關閉面板並保存更改
  const saveAndCloseImageMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 應用更改到模型中
    applyImageChanges();

    // 關閉選單
    setShowImageSizeMenu(false);
  };

  // 檢查是否有選中圖片
  const isImageSelected = () => {
    if (!editor) return false;

    const selectedImage = getSelectedImage();
    if (selectedImage) {
      // 讀取當前選中圖片的寬度並設置imageSize
      const currentWidth = selectedImage.style.width;
      if (currentWidth) {
        // 將"100%"轉換為數字100
        const widthValue = parseInt(currentWidth, 10);
        if (!isNaN(widthValue) && widthValue !== imageSize) {
          setImageSize(widthValue);
        }
      }

      return true;
    }

    return editor.isActive("image");
  };

  return (
    <div className="menu-bar">
      {/* 基本格式按鈕 */}
      <div className="toolbar-group">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={RiBold}
          title="粗體"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={RiItalic}
          title="斜體"
        />

        {/* 更多格式選項 */}
        <div className="dropdown-container" ref={formattingMenuRef}>
          <ToolbarButton
            onClick={() => setShowFormattingMenu(!showFormattingMenu)}
            isActive={false}
            icon={RiMoreLine}
            title="更多格式"
          />
          {showFormattingMenu && (
            <div className="dropdown-menu formatting-menu">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive("underline")}
                icon={RiUnderline}
                title="底線"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                icon={RiStrikethrough}
                title="刪除線"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                isActive={editor.isActive("subscript")}
                icon={RiSubscript}
                title="下標"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                isActive={editor.isActive("superscript")}
                icon={RiSuperscript}
                title="上標"
              />
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().unsetAllMarks().clearNodes().run()
                }
                isActive={false}
                icon={RiFormatClear}
                title="清除格式"
              />
            </div>
          )}
        </div>
      </div>

      <div className="divider" />

      {/* 字型大小下拉菜單 */}
      <div className="dropdown-container" ref={fontSizeMenuRef}>
        <ToolbarButton
          onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
          isActive={false}
          icon={RiFontSize}
          title="字體大小"
        />
        {showFontSizeMenu && (
          <div className="dropdown-menu fontsize-menu">
            {fontSizes.map((size) => (
              <button
                key={size.size}
                onClick={(e) => {
                  preventDefault(e);
                  // 使用原生 HTML 的 font 元素和 size 屬性
                  editor.chain().focus().run();
                  const html = `<span style="font-size: ${size.size}">${
                    window.getSelection()?.toString() || ""
                  }</span>`;
                  editor.commands.insertContent(html);
                  setShowFontSizeMenu(false);
                }}
                className={
                  editor.getAttributes("textStyle").fontSize === size.size
                    ? "is-active"
                    : ""
                }
              >
                <span style={{ fontSize: size.size }}>{size.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 顏色下拉菜單 */}
      <div className="dropdown-container" ref={colorMenuRef}>
        <ToolbarButton
          onClick={() => setShowColorMenu(!showColorMenu)}
          isActive={false}
          icon={RiFontColor}
          title="文字顏色"
        />
        {showColorMenu && (
          <div className="dropdown-menu color-menu">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={(e) => {
                  preventDefault(e);
                  editor.chain().focus().setColor(color.value).run();
                  setShowColorMenu(false);
                }}
                className={
                  editor.getAttributes("textStyle").color === color.value
                    ? "is-active"
                    : ""
                }
              >
                <span
                  className="color-sample"
                  style={{ backgroundColor: color.value }}
                ></span>
                {color.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="divider" />

      {/* 標題下拉選單 */}
      <div className="dropdown-container" ref={headingMenuRef}>
        <ToolbarButton
          onClick={() => setShowHeadingMenu(!showHeadingMenu)}
          isActive={editor.isActive("heading")}
          icon={RiHeading}
          title="標題"
        />
        {showHeadingMenu && (
          <div className="dropdown-menu heading-menu">
            <button
              onClick={(e) => {
                preventDefault(e);
                editor.chain().focus().setParagraph().run();
                setShowHeadingMenu(false);
              }}
              className={editor.isActive("paragraph") ? "is-active" : ""}
            >
              <RiParagraph /> 正文
            </button>
            <button
              onClick={(e) => {
                preventDefault(e);
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                setShowHeadingMenu(false);
              }}
              className={
                editor.isActive("heading", { level: 1 }) ? "is-active" : ""
              }
            >
              <RiH1 /> 標題 1
            </button>
            <button
              onClick={(e) => {
                preventDefault(e);
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                setShowHeadingMenu(false);
              }}
              className={
                editor.isActive("heading", { level: 2 }) ? "is-active" : ""
              }
            >
              <RiH2 /> 標題 2
            </button>
            <button
              onClick={(e) => {
                preventDefault(e);
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                setShowHeadingMenu(false);
              }}
              className={
                editor.isActive("heading", { level: 3 }) ? "is-active" : ""
              }
            >
              <RiH3 /> 標題 3
            </button>
          </div>
        )}
      </div>

      {/* 清單按鈕 */}
      <div className="toolbar-group">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={RiListUnordered}
          title="無序列表"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={RiListOrdered}
          title="有序列表"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive("taskList")}
          icon={RiListCheck2}
          title="待辦事項"
        />
      </div>

      <div className="divider" />

      {/* 對齊下拉選單 */}
      <div className="dropdown-container" ref={alignMenuRef}>
        <ToolbarButton
          onClick={() => setShowAlignMenu(!showAlignMenu)}
          isActive={false}
          icon={RiAlignVertically}
          title="對齊"
        />
        {showAlignMenu && (
          <div className="dropdown-menu align-menu">
            <button
              onClick={(e) => {
                preventDefault(e);
                editor.chain().focus().setTextAlign("left").run();
                setShowAlignMenu(false);
              }}
              className={
                editor.isActive({ textAlign: "left" }) ? "is-active" : ""
              }
            >
              <RiAlignLeft /> 靠左
            </button>
            <button
              onClick={(e) => {
                preventDefault(e);
                editor.chain().focus().setTextAlign("center").run();
                setShowAlignMenu(false);
              }}
              className={
                editor.isActive({ textAlign: "center" }) ? "is-active" : ""
              }
            >
              <RiAlignCenter /> 置中
            </button>
            <button
              onClick={(e) => {
                preventDefault(e);
                editor.chain().focus().setTextAlign("right").run();
                setShowAlignMenu(false);
              }}
              className={
                editor.isActive({ textAlign: "right" }) ? "is-active" : ""
              }
            >
              <RiAlignRight /> 靠右
            </button>
            <button
              onClick={(e) => {
                preventDefault(e);
                editor.chain().focus().setTextAlign("justify").run();
                setShowAlignMenu(false);
              }}
              className={
                editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
              }
            >
              <RiAlignJustify /> 兩端
            </button>
          </div>
        )}
      </div>

      <div className="divider" />

      {/* 插入下拉選單 */}
      <div className="dropdown-container" ref={insertMenuRef}>
        <ToolbarButton
          onClick={() => setShowInsertMenu(!showInsertMenu)}
          isActive={false}
          icon={RiInsertColumnRight}
          title="插入"
        />
        {showInsertMenu && (
          <div className="dropdown-menu insert-menu">
            <button
              onClick={(e) => {
                preventDefault(e);
                editor.chain().focus().toggleCodeBlock().run();
                setShowInsertMenu(false);
              }}
              className={editor.isActive("codeBlock") ? "is-active" : ""}
            >
              <RiCodeBoxLine /> 程式碼區塊
            </button>
            <button
              onClick={(e) => {
                preventDefault(e);
                setLink();
                setShowInsertMenu(false);
              }}
              className={editor.isActive("link") ? "is-active" : ""}
            >
              <RiLink /> 插入連結
            </button>
            <button
              onClick={(e) => {
                preventDefault(e);
                addImage();
                setShowInsertMenu(false);
              }}
              className={editor.isActive("image") ? "is-active" : ""}
            >
              <RiImage2Line /> 插入圖片
            </button>
            <button
              onClick={(e) => {
                preventDefault(e);
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run();
                setShowInsertMenu(false);
              }}
              className={editor.isActive("table") ? "is-active" : ""}
            >
              <RiTable2 /> 插入表格
            </button>
          </div>
        )}
      </div>

      {/* 圖片大小工具 */}
      {isImageSelected() && (
        <div className="dropdown-container" ref={imageSizeMenuRef}>
          <ToolbarButton
            onClick={() => setShowImageSizeMenu(!showImageSizeMenu)}
            isActive={false}
            icon={RiImage2Line}
            title="圖片大小"
          />
          {showImageSizeMenu && (
            <div className="dropdown-menu image-size-menu">
              <div className="image-size-control">
                <div className="image-size-label">
                  <span>圖片大小</span>
                  <span>{imageSize}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={imageSize}
                  onChange={handleImageSizeChange}
                />

                <button onClick={saveAndCloseImageMenu} className="close-btn">
                  套用並關閉
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
