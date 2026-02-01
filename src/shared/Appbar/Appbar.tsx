import * as React from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  InputBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SearchWrap = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  width: "100%",
  maxWidth: 820,
  background: "#fff",
  borderRadius: 14,
  padding: "10px 14px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  border: "1px solid #eef1f5",
}));

const SearchInput = styled(InputBase)(() => ({
  width: "100%",
  color: "#111827",
  fontSize: 14,
}));

export default function Appbar() {
  const userName = localStorage.getItem("userName") || "User";

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          width: "95%",
          bgcolor: "#F8F9FB",
          borderRadius: 3,
          px: 1.5,
          py: 0.5,
        }}
      >
        <Toolbar sx={{ minHeight: 64, gap: 2 }}>
          {/* Search */}
          <SearchWrap>
            <SearchIcon sx={{ color: "#6B7280" }} />
            <SearchInput placeholder="Search Here" inputProps={{ "aria-label": "search" }} />
          </SearchWrap>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                borderRadius: 999,
                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              <Avatar
                sx={{ width: 34, height: 34 }}
                src="" // حط لينك الصورة لو موجود
              />
            </IconButton>

            <Typography
              sx={{
                color: "#111827",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {userName}
            </Typography>

            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              <ExpandMoreIcon sx={{ color: "#111827" }} />
            </IconButton>

            <IconButton
              sx={{
                p: 0.9,
                borderRadius: 2,
                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              <Badge
                variant="dot"
                color="error"
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <NotificationsIcon sx={{ color: "#111827" }} />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            minWidth: 180,
            boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      </Menu>
    </Box>
  );
}

