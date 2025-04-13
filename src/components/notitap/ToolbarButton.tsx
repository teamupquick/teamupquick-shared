import { IconType } from "react-icons";
import "./ToolbarButton.css";
import React from "react";

interface ToolbarButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  icon: IconType;
  title: string;
}

export const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
  title,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={(e) => {
        // 防止事件冒泡和默認行為
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      className={`toolbar-button ${isActive ? "is-active" : ""}`}
      title={title}
      type="button"
    >
      <Icon />
    </button>
  );
};
