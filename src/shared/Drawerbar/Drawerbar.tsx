import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import RoomIcon from "@mui/icons-material/Room";
import AdsIcon from "@mui/icons-material/Announcement";
import EventIcon from "@mui/icons-material/Event";
import BuildIcon from "@mui/icons-material/Build";
import LockIcon from "@mui/icons-material/Lock";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import PATHS from "../../services/paths";

const drawerWidth = 300;

const iconMapping: Record<string, React.ReactNode> = {
  Home: <HomeIcon />,
  Users: <PeopleIcon />,
  Rooms: <RoomIcon />,
  Ads: <AdsIcon />,
  Bookings: <EventIcon />,
  Facilities: <BuildIcon />,
  ChangePassword: <LockIcon />,
  Logout: <ExitToAppIcon />,
};

const pathMapping: Record<string, string> = {
  Home: "/dashboard/home",
  Users: "/dashboard/users",
  Rooms: "/dashboard/rooms",
  Ads: PATHS.ADS_LIST_PATH,
  Bookings: "/dashboard/bookings",
  Facilities: "/dashboard/facilities-list",

  ChangePassword: "/change-password",
  Logout: "/dashboard/logout", // هنستغنى عنها في الـUI ونستخدم Dialog بدلها

 
};

export default function Drawerbar() {
  const [open, setOpen] = useState(true);
  const [openLogout, setOpenLogout] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setOpen((p) => !p);

  const logout = () => {
    // ✅ امسح اللي انت مخزنه
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    // لو عندك حاجات تانية: localStorage.clear();

    setOpenLogout(false);
    navigate("/login", { replace: true }); // عدّلها لروت اللوجين عندك
  };

  const items = [
    "Home",
    "Users",
    "Rooms",
    "Ads",
    "Bookings",
    "Facilities",
    "ChangePassword",
    "Logout",
  ];

  return (
    <Box sx={{ display: "flex", overflowX: "hidden" }}>
      <CssBaseline />

      <Drawer
        variant="permanent"
        anchor="left"
        open={open}
        sx={{
          width: open ? drawerWidth : 80,
          flexShrink: 0,
          overflowX: "hidden",
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 80,
            transition: "width 0.3s ease",
            backgroundColor: "#203FC7",
            color: "#fff",
            overflowX: "hidden",
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>

        <List sx={{ overflowX: "hidden" }}>
          {items.map((text) => {
            const isLogout = text === "Logout";

            const button = (
              <ListItemButton
                onClick={isLogout ? () => setOpenLogout(true) : undefined}
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  justifyContent: open ? "initial" : "center",
                  color: "#fff",
                  px: 2,
                  borderRadius: 2,
                  mx: 1,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                    mr: open ? 3 : "auto",
                    color: "#fff",
                  }}
                >
                  {iconMapping[text]}
                </ListItemIcon>

                <ListItemText
                  primary={<Typography variant="body2">{text}</Typography>}
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    whiteSpace: "nowrap",
                  }}
                />
              </ListItemButton>
            );

            return (
              <ListItem key={text} disablePadding sx={{ width: "100%" }}>
                {isLogout ? (
                  button
                ) : (
                  <Link
                    to={pathMapping[text]}
                    style={{
                      textDecoration: "none",
                      width: "100%",
                      display: "flex",
                      overflow: "hidden",
                    }}
                  >
                    {button}
                  </Link>
                )}
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* ✅ Logout Dialog */}
      <Dialog
        open={openLogout}
        onClose={() => setOpenLogout(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <LogoutIcon />
          Logout
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ color: "text.secondary" }}>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenLogout(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={logout}
            variant="contained"
            color="error"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
