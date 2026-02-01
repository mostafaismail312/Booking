import React, { useEffect, useState } from 'react'
import { PieChart } from '@mui/x-charts/PieChart';
import { axiosInstance } from '../../../services/axiosInstance';
import { ADMIN_URLS } from '../../../services/apiEndpoints';
import { Box, Stack, Typography } from "@mui/material";

export default function Charts() {

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
    const data = [
  { label: 'Pending', value: dashboardData?.bookings.pending, color: '#5368F0' },
  { label: 'Completed', value:dashboardData?.bookings.completed, color: '#9D57D5' },

];

const settings = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: true,
};
  return (
 
<Box sx={{ display: "flex", alignItems: "center" }}>
  <PieChart
    series={[{ innerRadius: 50, outerRadius: 100, data, arcLabel: "value" }]}
    width={230}   
    height={220}
    margin={{ left: 0, right: 0, top: 0, bottom: 0 }} 
    slotProps={{
      legend: { hidden: true },
    }}
  />

  {/* <Stack spacing={1} sx={{ ml: -2 }}> 
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: 12, height: 12, borderRadius: 0.7, bgcolor: data[0].color }} />
      <Typography variant="body2">pending</Typography>
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: 12, height: 12, borderRadius: 0.7, bgcolor: data[1].color }} />
      <Typography variant="body2">completed</Typography>
    </Box>
  </Stack> */}
</Box>
  )
}

