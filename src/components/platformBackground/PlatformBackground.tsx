import { Box } from "@mui/material";
import LeftBG1SVG from "@shared-assets/svg/login_left_bg1.svg?react";
import LeftBG2SVG from "@shared-assets/svg/login_left_bg2.svg?react";
import RightBG1SVG from "@shared-assets/svg/login_right_bg1.svg?react";
import RightBG2SVG from "@shared-assets/svg/login_right_bg2.svg?react";
import type { ReactNode } from "react";
import Z_INDEX from "@shared/constants/zIndex";

type Props = {
  children: ReactNode;
};

export default function PlatformBackground({ children }: Props) {
  return (
    <Box
      component="div"
      position="relative"
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "calc(100vh - 70px)",
        overflow: "hidden",
      }}
    >
      {/* 左側背景元素 - 調整到左上方 */}
      <Box
        position="absolute"
        sx={{ left: 0, top: 0, zIndex: Z_INDEX.LAYER1.BACKGROUND }}
      >
        <LeftBG2SVG
          style={{
            position: "absolute",
            top: "calc(40vh - 234px - 25px)",
            left: 0,
          }}
        />
        <LeftBG1SVG
          style={{ position: "absolute", top: "calc(40vh - 234px)", left: 0 }}
        />
      </Box>

      {/* 右側背景元素 */}
      <Box
        position="absolute"
        sx={{ right: 0, bottom: 0, zIndex: Z_INDEX.LAYER1.BACKGROUND }}
      >
        <RightBG2SVG style={{ position: "absolute", bottom: 0, right: 0 }} />
        <RightBG1SVG style={{ position: "absolute", bottom: 0, right: 0 }} />
      </Box>

      {/* 內容區域，確保在背景之上 */}
      <Box
        position="relative"
        sx={{ zIndex: Z_INDEX.LAYER1.CONTENT_BASE, height: "100%" }}
      >
        {children}
      </Box>
    </Box>
  );
}
