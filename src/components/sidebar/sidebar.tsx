import Logo from "@shared/components/logo/Logo";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import GridViewIcon from "@mui/icons-material/GridView";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  styled,
} from "@mui/material";
import { theme } from "@shared/utils/theme";

import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@shared/utils/routes";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import HiddenLayout from "@shared/components/hiddenLayout/HiddenLayout";

interface Props {
  children: ReactNode;
}

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "primary",
})<{
  primary?: boolean;
}>(
  {
    marginTop: "8px",
    borderRadius: "8px",
  },
  (props) => ({
    backgroundColor: props.primary ? theme.text.primary : theme.neutralWhite,
    color: props.primary ? theme.neutralWhite : theme.text.secondary,
    ":hover": { color: theme.text.secondary },
  }),
);

export default function Sidebar({ children }: Props) {
  const navigate = useNavigate();
  const [openProject, toggleProject] = useState(false);
  const [openFinance, toggleFinance] = useState(false);
  const { pathname } = useLocation();

  const handleRedirect = (path: string) => navigate(path);
  const handleProjectMenuClick = () => toggleProject((prev) => !prev);
  const handleFinanceMenuClick = () => toggleFinance((prev) => !prev);
  const handleLogoClick = () => navigate(ROUTES.home);

  useEffect(() => {
    toggleProject(pathname.includes("project"));
    toggleFinance(pathname === ROUTES.point || pathname === ROUTES.budget);
  }, [pathname]);

  return (
    <Box
      component="section"
      sx={{
        minHeight: "100vh",
        width: "264px",
        background: theme.neutralWhite,
        padding: "32px 18px",
        boxShadow: "4px 0px 30px 0px #8362EA0D",
        borderRight: `1px solid ${theme.border.primary}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
          paddingLeft: "10%",
        }}
      >
        <Logo onClick={handleLogoClick} styles={{ cursor: "pointer" }} />
      </Box>
      <div style={{ height: "24px" }} />

      <Box component="nav">
        <List>
          <HiddenLayout>
            <StyledListItemButton
              primary={pathname === ROUTES.dashboard}
              sx={{ mt: "0px" }}
              onClick={() => handleRedirect(ROUTES.dashboard)}
            >
              <GridViewIcon />
              <ListItemText sx={{ ml: "8px" }} primary="儀表板" />
            </StyledListItemButton>
          </HiddenLayout>

          <StyledListItemButton
            primary={pathname.includes(ROUTES.project.split("/")[1])}
            onClick={handleProjectMenuClick}
          >
            <DescriptionOutlinedIcon />
            <ListItemText sx={{ ml: "8px" }} primary="專案管理" />
            {openProject ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </StyledListItemButton>
          <Collapse component="li" in={openProject}>
            {children}
          </Collapse>

          <StyledListItemButton
            primary={pathname === ROUTES.point || pathname === ROUTES.budget}
            onClick={handleFinanceMenuClick}
          >
            <AccountBalanceIcon />
            <ListItemText sx={{ ml: "8px" }} primary="財務管理" />
            {openFinance ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </StyledListItemButton>
          <Collapse component="li" in={openFinance}>
            <Box display="flex" flexDirection="column">
              <List disablePadding>
                <StyledListItemButton
                  primary={pathname === ROUTES.point}
                  onClick={() => handleRedirect(ROUTES.point)}
                  sx={{ paddingLeft: "32px" }}
                >
                  <ListItemText primary="點數管理" />
                </StyledListItemButton>
                
                <StyledListItemButton
                  primary={pathname === ROUTES.budget}
                  onClick={() => handleRedirect(ROUTES.budget)}
                  sx={{ paddingLeft: "32px" }}
                >
                  <ListItemText primary="預算管理" />
                </StyledListItemButton>
              </List>
            </Box>
          </Collapse>

          <HiddenLayout>
            <StyledListItemButton
              primary={pathname === ROUTES.tempInvitationList}
              onClick={() => handleRedirect(ROUTES.tempInvitationList)}
            >
              <GridViewIcon />
              <ListItemText sx={{ ml: "8px" }} primary="暫時邀請URL列表" />
            </StyledListItemButton>
          </HiddenLayout>

          <HiddenLayout>
            <StyledListItemButton>
              <ForumOutlinedIcon />
              <ListItemText sx={{ ml: "8px" }} primary="訊息中心" />
            </StyledListItemButton>
          </HiddenLayout>

          <StyledListItemButton
            primary={pathname === ROUTES.talents}
            onClick={() => handleRedirect(ROUTES.talents)}
          >
            <GroupsOutlinedIcon />
            <ListItemText sx={{ ml: "8px" }} primary="人才資料庫" />
          </StyledListItemButton>

          <StyledListItemButton
            primary={pathname === ROUTES.leaders}
            onClick={() => handleRedirect(ROUTES.leaders)}
          >
            <GroupsOutlinedIcon />
            <ListItemText sx={{ ml: "8px" }} primary="隊長資料庫" />
          </StyledListItemButton>
        </List>
      </Box>
    </Box>
  );
}
