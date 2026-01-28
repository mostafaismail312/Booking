import React, { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import RoomIcon from '@mui/icons-material/Room';
import AdsIcon from '@mui/icons-material/Announcement';
import EventIcon from '@mui/icons-material/Event';
import BuildIcon from '@mui/icons-material/Build';
import LockIcon from '@mui/icons-material/Lock';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Link } from 'react-router-dom';
import { Box, CssBaseline, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';

const drawerWidth = 300;

const iconMapping = {
  Home: <HomeIcon />,
  Users: <PeopleIcon />,
  Rooms: <RoomIcon />,
  Ads: <AdsIcon />,
  Bookings: <EventIcon />,
  Facilities: <BuildIcon />,
  'Change Password': <LockIcon />,
  Logout: <ExitToAppIcon />,
};

const pathMapping = {
  Home: '/dashboard/home',
  Users: '/dashboard/users',
  Rooms: '/dashboard/rooms',
  Ads: '/dashboard/ads',
  Bookings: '/dashboard/bookings',
  Facilities: '/dashboard/facilities',
  'Change Password': '/dashboard/change-password',
  Logout: '/dashboard/logout',
};

const Drawerbar: React.FC = () => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            transition: 'width 0.3s ease',
            backgroundColor: '#203FC7',
            color: '#fff',
          },
        }}
        variant="permanent"
        anchor="left"
        open={open}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>

        <List>
          {['Home', 'Users', 'Rooms', 'Ads', 'Bookings', 'Facilities', 'Change Password', 'Logout'].map((text) => (
            <ListItem key={text} disablePadding>
              <Link to={pathMapping[text]} style={{ textDecoration: 'none' }}>
                <ListItemButton sx={{ justifyContent: open ? 'initial' : 'center', color: '#fff' }}>
                  <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto', color: '#fff' }}>
                    {iconMapping[text]}
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2">{text}</Typography>}
                    sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.5s ease' }}
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





