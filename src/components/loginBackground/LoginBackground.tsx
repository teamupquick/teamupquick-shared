import { Box } from "@mui/material";
import LeftBG1SVG from "@shared-assets/svg/login_left_bg1.svg?react";
import LeftBG2SVG from "@shared-assets/svg/login_left_bg2.svg?react";
import RightBG1SVG from "@shared-assets/svg/login_right_bg1.svg?react";
import RightBG2SVG from "@shared-assets/svg/login_right_bg2.svg?react";
import { ReactNode } from "react";
import Logo from "@shared/components/logo/Logo";
import { HOMEPAGE_URL } from "@shared/utils/utils";

type Props = {
  children: ReactNode;
};

export default function LoginBackground({ children }: Props) {
  return (
    <Box
      component="section"
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
    >
      <Logo
        styles={{ position: "absolute", top: "40px", left: "60px" }}
        onClick={() => {
          window.location.href = HOMEPAGE_URL;
        }}
      />

      <Box position="relative">
        <LeftBG2SVG
          style={{
            position: "absolute",
            top: "calc(50vh - 234px - 25px)",
            left: 0,
          }}
        />
        <LeftBG1SVG
          style={{ position: "absolute", top: "calc(50vh - 234px)", left: 0 }}
        />
      </Box>
      {children}
      <Box position="relative">
        <RightBG2SVG style={{ position: "absolute", bottom: 0, right: 0 }} />
        <RightBG1SVG style={{ position: "absolute", bottom: 0, right: 0 }} />
      </Box>
    </Box>
  );
}
