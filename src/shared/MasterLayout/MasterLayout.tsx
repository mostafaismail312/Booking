import React from 'react';
import { Box, CssBaseline, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Appbar from '../Appbar/Appbar'; 
import Drawerbar from '../Drawerbar/Drawerbar'; 

export default function MasterLayout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
     
      <Drawerbar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Appbar />  
        
        <Box
          sx={{
           
            flexGrow: 1,
            overflow:'auto',
            backgroundColor: '#4b0909',
            padding: 2,
          }}
        >
        
            <Outlet /> 
       
        </Box>
      </Box>
    </Box>
  );
}