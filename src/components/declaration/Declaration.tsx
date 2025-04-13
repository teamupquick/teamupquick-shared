import { Box, Button, Checkbox, Typography } from "@mui/material";
import { theme } from "@shared/utils/theme";
import React, { ChangeEvent, useState } from "react";
import DeclarationDialog from "./DeclarationDialog";

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export default function Declaration(props: Props) {
  const [showDeclaration, toggleDeclaration] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleDeclarationDialogOpen = () => toggleDeclaration(true);

  const handleDeclarationDialogClose = () => {
    toggleDeclaration(false);
    setHasReadTerms(true);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!hasReadTerms) {
      // 如果尚未閱讀條款，則打開條款對話框
      handleDeclarationDialogOpen();
      return;
    }

    // 已閱讀條款，可以勾選
    setIsChecked(event.target.checked);
    props.onChange(event, event.target.checked);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", mt: "16px" }}>
      <Checkbox
        checked={isChecked}
        onChange={handleCheckboxChange}
        inputProps={{ "aria-label": "controlled" }}
        sx={{
          p: "0px",
          mr: "8px",
          color: "#E0E2E7",
          "&.Mui-checked": { color: "#3B3839" },
        }}
      />

      <Typography
        sx={{ display: "flex", alignItems: "center", fontSize: "14px" }}
      >
        同意
        <Button
          sx={{
            padding: "0px",
            color: theme.text.primary,
            fontSize: "14px",
            textDecoration: "underline",
            minWidth: "auto",
          }}
          onClick={handleDeclarationDialogOpen}
        >
          保密協定及平台約定
        </Button>
      </Typography>

      {showDeclaration && (
        <DeclarationDialog onClose={handleDeclarationDialogClose} />
      )}
    </Box>
  );
}
