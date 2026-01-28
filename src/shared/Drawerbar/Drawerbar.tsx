import React, { useState } from 'react';
import { Box, CssBaseline, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Inbox as InboxIcon, Mail as MailIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';

const drawerWidth = 240; // العرض الكامل للـ Drawer

const Drawerbar: React.FC = () => {
  const [open, setOpen] = useState(true); // حالة فتح أو غلق الـ Drawer

  // Function to toggle the drawer open/close
  const handleDrawerToggle = () => {
    setOpen(!open); // تغيير الحالة بين الفتح والغلق
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: open ? drawerWidth : 60, // Change width based on open state
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60, // Same here for the paper style
            transition: 'width 0.3s ease',
            backgroundColor: '#333',
            color: '#fff',
          },
        }}
        variant="permanent"
        anchor="left"
        open={open}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />} {/* Button to close or open the Drawer */}
          </IconButton>
        </Box>

        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton sx={{ justifyContent: open ? 'initial' : 'center' }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} {/* Icons */}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s ease' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Drawerbar;




