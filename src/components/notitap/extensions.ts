import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Color from "@tiptap/extension-color";
import Focus from "@tiptap/extension-focus";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { common, createLowlight } from "lowlight";
import { Extension } from "@tiptap/core";

const lowlight = createLowlight(common);

// 自定義圖片擴展
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) => {
          const width = element.style.width;

          return width;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {
              style: "width: 100%",
            };
          }
          return {
            style: `width: ${attributes.width}`,
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.style.height;

          return height;
        },
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }

          return {
            style: `height: ${attributes.height}`,
          };
        },
      },
      alt: {
        default: "",
        parseHTML: (element) => {
          const alt = element.getAttribute("alt");

          return alt;
        },
        renderHTML: (attributes) => {
          if (!attributes.alt) {
            return {};
          }

          return { alt: attributes.alt };
        },
      },
      title: {
        default: "",
        parseHTML: (element) => {
          const title = element.getAttribute("title");

          return title;
        },
        renderHTML: (attributes) => {
          if (!attributes.title) {
            return {};
          }

          return { title: attributes.title };
        },
      },
    };
  },
});

// 自定義字體大小擴展
const FontSize = Extension.create({
  name: "fontSize",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
});

export const extensions = [
  StarterKit.configure({
    codeBlock: false,
  }),
  CharacterCount.configure({
    limit: 10000,
  }),
  TextStyle,
  FontSize,
  Color,
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Focus.configure({
    className: "has-focus",
    mode: "all",
  }),
  FontFamily,
  Highlight.configure({
    multicolor: true,
  }),
  CustomImage.configure({
    HTMLAttributes: {
      class: "resizable-image",
    },
    allowBase64: true,
  }),
  Link.configure({
    openOnClick: true,
  }),
  Placeholder.configure({
    placeholder: "輸入...",
  }),
  Subscript,
  Superscript,
  Table.configure({
    resizable: true,
  }),
  TableCell,
  TableHeader,
  TableRow,
  TaskList.configure({
    HTMLAttributes: {
      class: "task-list",
    },
  }),
  TaskItem.configure({
    nested: true,
    HTMLAttributes: {
      class: "task-item",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Typography,
  Underline,
];
