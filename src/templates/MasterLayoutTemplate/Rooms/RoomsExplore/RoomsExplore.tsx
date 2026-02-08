import React from 'react'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { axiosInstance } from "../../../../services/axiosInstance";
import { PORTAL_URLS } from "../../../../services/apiEndpoints";
import { useNavigate, useSearchParams } from "react-router-dom";
import defaultpic from "../../../../assets/images/defaultroom.png";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

interface Room {
  _id: string;
  price: number;
  images: string[];
}

export default function RoomsExplore() {

    const [rooms, setRooms] = useState<Room[]>([]);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? 1);
    const size = Number(searchParams.get("size") ?? 10);
    const startDate = searchParams.get("startDate") ?? "";
    const endDate = searchParams.get("endDate") ?? "";

    useEffect(() => {
  axiosInstance
    .get(`${PORTAL_URLS.ROOMS.GET_ALL_ROOMS}/available`, {
      params: {
        page,
        size,
        startDate,
        endDate,
      },
    })
    .then((res) => {
      setRooms(res.data?.data?.rooms || []);
    })
    .catch(console.error);
}, [page, size, startDate, endDate]);



  return (
    <>
    <Container maxWidth="lg">
  <Box sx={{ width: "100%", mt: 4, mb: 6 }}>
    <Grid container spacing={4} justifyContent="center">
      {rooms.map((room) => (
        <Grid
          size={4}
          key={room._id}
          sx={{
            display: "flex",
            justifyContent: "center", // 🔥 centers card in column
          }}
        >
          <Box
            onClick={() => navigate(`/room-details/${room._id}`)}
            sx={{
              width: 270, // 🔥 fixed card width
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 4,
              cursor: "pointer",
              backgroundColor: "background.paper",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: 8,
              },
            }}
          >
            {/* Image */}
            <Box sx={{ width: "100%", height: 270, overflow: "hidden" }}>
              <Box
                component="img"
                src={room.images?.[0] || defaultpic}
                alt={ "Room"}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>

            {/* Price badge */}
            <Box
              sx={{
                position: "absolute",
                top: 14,
                right: 14,
                backgroundColor: "#ff4da6",
                color: "#fff",
                px: 2,
                py: 0.6,
                borderRadius: "20px",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              ${room.price} / night
            </Box>

            {/* Bottom overlay */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                color: "#fff",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                { "Luxury Room"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                { "City Center"}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
</Container>



    </>
  )
}
