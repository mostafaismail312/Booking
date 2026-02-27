import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography, Icon } from '@mui/material';
import { Box } from '@mui/system';
import BusinessIcon from '@mui/icons-material/Business';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BuildIcon from '@mui/icons-material/Build';
import { axiosInstance } from '../../../services/axiosInstance';
import { ADMIN_URLS } from '../../../services/apiEndpoints';
import Charts from './Charts';

export default function ChartsSquare() {
       const [dashboardData, setDashboardData] = useState<any>(null);
      const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(ADMIN_URLS.DASHBOARD.GET_SUMMARY);
    
          console.log('Response data:', response.data);
          setDashboardData(response.data.data); 
    
          const usersData = Array.isArray(response.data.data.users)
            ? response.data.data.users
            : [];
    
          if (usersData.length === 0) {
            console.warn('No users data available');
          }
    
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
    }, []);
  return (
   
      <Grid container spacing={15} sx={{ 
        marginLeft: 20,
        marginRight:20,
        marginTop:10 }}>
      {/* First Card */}
      <Grid size={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2, backgroundColor: '#1A202C' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' ,width:'100%'}}>
            <Box>
              <Typography variant="h5" color="white">
                {dashboardData?.rooms}
              </Typography>
              <Typography variant="body2" color="white">
                Rooms
              </Typography>
            </Box>
           <Icon
  sx={{
    backgroundColor: '#203FC733',
    borderRadius: '50%',
    padding: 4,
    color: '#fff',
    display: 'flex',           // Use flexbox
    justifyContent: 'center',  // Horizontally center
    alignItems: 'center',      // Vertically center
  }}
>
  <BuildIcon sx={{ fontSize: '1rem' }} />  {/* Adjust the icon size if needed */}
</Icon>
          </CardContent>
        </Card>
      </Grid>

      {/* Second Card */}
      < Grid size={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2, backgroundColor: '#1A202C' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:'100%'}}>
            <Box>
              <Typography variant="h5" color="white">
                {dashboardData?.facilities}
              </Typography>
              <Typography variant="body2" color="white">
                Facilities
              </Typography>
            </Box>
           <Icon
  sx={{
    backgroundColor: '#203FC733',
    borderRadius: '50%',
    padding: 4,
    color: '#fff',
    display: 'flex',           // Use flexbox
    justifyContent: 'center',  // Horizontally center
    alignItems: 'center',      // Vertically center
  }}
>
  <BuildIcon sx={{ fontSize: '1rem' }} />  {/* Adjust the icon size if needed */}
</Icon>
          </CardContent>
        </Card>
      </Grid>

      {/* Third Card */}
      <Grid size={4}>
        <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2, backgroundColor: '#1A202C' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' ,width:'100%' }}>
            <Box>
              <Typography variant="h5" color="white">
                 {dashboardData?.ads}
              </Typography>
              <Typography variant="body2" color="white">
                Ads
              </Typography>
            </Box>
          <Icon
  sx={{
    backgroundColor: '#203FC733',
    borderRadius: '50%',
    padding: 4,
    color: '#fff',
    display: 'flex',           // Use flexbox
    justifyContent: 'center',  // Horizontally center
    alignItems: 'center',      // Vertically center
  }}
>
  <BuildIcon sx={{ fontSize: '1rem' }} />  {/* Adjust the icon size if needed */}
</Icon>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
