import React from 'react';
import { Box } from "@mui/material";

// 臨時替代SVG導入問題
interface SVGProps {
  style?: React.CSSProperties;
}

const LeftBG1SVG: React.FC<SVGProps> = ({ style }) => (
  <div style={{ width: 100, height: 100, background: '#e1e1e1', ...style }}></div>
);
const LeftBG2SVG: React.FC<SVGProps> = ({ style }) => (
  <div style={{ width: 100, height: 100, background: '#f1f1f1', ...style }}></div>
);
const RightBG1SVG: React.FC<SVGProps> = ({ style }) => (
  <div style={{ width: 100, height: 100, background: '#d1d1d1', ...style }}></div>
);
const RightBG2SVG: React.FC<SVGProps> = ({ style }) => (
  <div style={{ width: 100, height: 100, background: '#c1c1c1', ...style }}></div>
);

interface PlatformBackgroundProps {
  children: React.ReactNode;
}

export default function PlatformBackground({ children }: PlatformBackgroundProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#f5f7fa",
        padding: "16px",
      }}
    >
      <Box sx={{ position: "relative", flex: 1, display: "flex" }}>
        {children}
      </Box>

      <Box position="relative">
        <LeftBG2SVG
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 1,
          }}
        />
        <LeftBG1SVG
          style={{ position: "absolute", bottom: 0, left: 0 }}
        />
      </Box>
      <Box position="relative">
        <RightBG2SVG style={{ position: "absolute", bottom: 0, right: 0 }} />
        <RightBG1SVG style={{ position: "absolute", bottom: 0, right: 0 }} />
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "12px",
          color: "#777",
        }}
      >
        © {new Date().getFullYear()} TeamUpQuick. All rights reserved.
      </Box>
    </Box>
  );
}
