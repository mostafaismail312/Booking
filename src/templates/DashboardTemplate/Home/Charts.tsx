import React, { useEffect, useState } from 'react'
import { PieChart } from '@mui/x-charts/PieChart';
import { axiosInstance } from '../../../services/axiosInstance';
import { ADMIN_URLS } from '../../../services/apiEndpoints';

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
  { label: 'Group A', value: dashboardData?.bookings.pending, color: '#0088FE' },
  { label: 'Group B', value:dashboardData?.bookings.completed, color: '#00C49F' },
  { label: 'Group C', value: 300, color: '#FFBB28' },
  { label: 'Group D', value: 200, color: '#FF8042' },
];

const settings = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: true,
};
  return (
     <PieChart
     sx={{margin:'20'}}
      series={[{ innerRadius: 50, outerRadius: 100, data, arcLabel: 'value' }]}
      {...settings}
    />
  )
}

