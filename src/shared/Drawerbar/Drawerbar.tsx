import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import RoomIcon from "@mui/icons-material/Room";
import AdsIcon from "@mui/icons-material/Announcement";
import EventIcon from "@mui/icons-material/Event";
import BuildIcon from "@mui/icons-material/Build";
import LockIcon from "@mui/icons-material/Lock";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";
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
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import PATHS from "../../services/paths";

const drawerWidth = 300;

const iconMapping: Record<string, React.ReactNode> = {
  Home: <HomeIcon />,
  Users: <PeopleIcon />,
  Rooms: <RoomIcon />,
  Ads: <AdsIcon />,
  Bookings: <EventIcon />,
  Facilities: <BuildIcon />,
  "Change Password": <LockIcon />,
  Logout: <ExitToAppIcon />,
};

const pathMapping: Record<string, string> = {
  Home: "/dashboard/home",
  Users: "/dashboard/users",
  Rooms: "/dashboard/rooms",
  Ads: PATHS.ADS_LIST_PATH,
  Bookings: "/dashboard/bookings",
  Facilities: "/dashboard/facilities-list",
  ChangePassword: PATHS.CHANGE_PASS_PATH,
  Logout: "/dashboard/logout",
};

const Drawerbar: React.FC = () => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const items = [
    "Home",
    "Users",
    "Rooms",
    "Ads",
    "Bookings",
    "Facilities",
    "Change Password",
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
          zIndex: (theme) => theme.zIndex.drawer,
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
          {items.map((text) => (
            <ListItem key={text} disablePadding sx={{ width: "100%", overflowX: "hidden" }}>
              <Link
                to={pathMapping[text]}
                style={{
                  textDecoration: "none",
                  width: "100%",
                  display: "flex",
                  overflow: "hidden",
                }}
              >
                <ListItemButton
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    justifyContent: open ? "initial" : "center",
                    color: "#fff",
                    px: 2,
                    borderRadius: 2,
                    mx: 1,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.12)",
                    },
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
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Drawerbar;

