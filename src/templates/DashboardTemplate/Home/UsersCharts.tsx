import React from "react";
import { Box, Paper, Stack, Typography, CircularProgress } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { axiosInstance } from "../../../services/axiosInstance";
import { ADMIN_URLS } from "../../../services/apiEndpoints";

export default function UsersCharts() {
  const [dashboardData, setDashboardData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(ADMIN_URLS.DASHBOARD.GET_SUMMARY);
        setDashboardData(res?.data?.data);
      } catch (e) {
        console.error(e);
        setError("Failed to load chart data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const userCount = Number(dashboardData?.users?.user ?? 0);
  const adminCount = Number(dashboardData?.users?.admin ?? 0);

  const chartData = [
    { id: 0, value: userCount, label: "User", color: "#37c66f" },
    { id: 1, value: adminCount, label: "Admin", color: "#34b5ff" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        width: 420,
        p: 3,
        borderRadius: 3,
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ position: "relative", display: "flex", justifyContent: "center", minHeight: 160 }}>
        {isLoading ? (
          <Box sx={{ height: 160, display: "flex", alignItems: "center" }}>
            <CircularProgress size={26} />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <PieChart
            series={[
              { data: chartData, innerRadius: 62, outerRadius: 78, paddingAngle: 2, cornerRadius: 6 },
            ]}
            width={240}     
            height={160}    
            hideLegend
          />
        )}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Typography sx={{ fontWeight: 500, color: "text.primary" }}>Users</Typography>
        </Box>
      </Box>

      <Stack spacing={2} sx={{ mt: 1 }}>
        {chartData.map((item) => (
          <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
              <Typography variant="body2">{item.label}</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}




