import React from 'react'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { axiosInstance } from '../../../../services/axiosInstance';
import { CircularProgress, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PORTAL_URLS } from "../../../../services/apiEndpoints";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import AlbumIcon from "@mui/icons-material/Album";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PublicIcon from "@mui/icons-material/Public";
import Typography from "@mui/material/Typography";


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
  images: string[];
}

export default function RoomDetails() {

  const { id } = useParams(); // room id from URL
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

     useEffect(() => {
    if (!id) return;

    const fetchRoomDetails = async () => {
      try {
        const res = await axiosInstance.get(PORTAL_URLS.ROOMS.GET_ROOM_DETAILS(id));
        setRoom(res.data?.data?.room);
      } catch (error) {
        console.error("Failed to load room details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!room) return null; 


  return (
    <>
       <Container maxWidth="lg">
        {/* ===== Images Section ===== */}
        <Box sx={{ width: "100%", mt: 3 }}>
            <Grid container spacing={2} alignItems="stretch">

            {/* Left – big image */}
            <Grid item xs={12} md={6}>
                <Box
                component="img"
                src={room.images?.[0]}
                alt="Room main"
                sx={{
                    width: "100%",
                    height: "100%",
                    maxHeight: 450,
                    borderRadius: 2,
                    objectFit: "cover",
                }}
                />
            </Grid>

            {/* Right – two images */}
            <Grid item xs={12} md={6}>
                <Grid container spacing={2} direction="column" height="100%">

                {room.images?.[1] && (
                    <Grid item>
                    <Box
                        component="img"
                        src={room.images[1]}
                        alt="Room view 1"
                        sx={{
                        width: "100%",
                        height: 215,
                        borderRadius: 2,
                        objectFit: "cover",
                        }}
                    />
                    </Grid>
                )}

                {room.images?.[2] && (
                    <Grid item>
                    <Box
                        component="img"
                        src={room.images[2]}
                        alt="Room view 2"
                        sx={{
                        width: "100%",
                        height: 215,
                        borderRadius: 2,
                        objectFit: "cover",
                        }}
                    />
                    </Grid>
                )}

                </Grid>
            </Grid>

            </Grid>
        </Box>

       {/* ===== Details Section – split into 2 equal columns ===== */}
<Box sx={{ width: "100%", mt: 5 }}>
  <Grid container spacing={3}>

    {/* Left column – paragraphs + icons */}
    <Grid item xs={12} md={6}>
      <Item sx={{ border: "1px solid #ccc", padding: 3 }}>
        {/* Paragraphs */}
        <Typography sx={{ mb: 2 }}>
          Minimal techno is a minimalist subgenre of techno music. It is characterized by a stripped-down aesthetic that exploits the use of repetition and understated development. Minimal techno is thought to have been originally developed in the early 1990s by Detroit-based producers Robert Hood and Daniel Bell.
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Such trends saw the demise of the soul-infused techno that typified the original Detroit sound. Robert Hood has noted that he and Daniel Bell both realized something was missing from techno in the post-rave era.
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Design is a plan or specification for the construction of an object or system or for the implementation of an activity or process, or the result of that plan or specification in the form of a prototype, product or process. The national agency for design: enabling Singapore to use design for economic growth and to make lives better.
        </Typography>

        {/* Icons Row 1 */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          <Grid item xs={3}><MusicNoteIcon fontSize="large" /></Grid>
          <Grid item xs={3}><GraphicEqIcon fontSize="large" /></Grid>
          <Grid item xs={3}><HeadphonesIcon fontSize="large" /></Grid>
          <Grid item xs={3}><AlbumIcon fontSize="large" /></Grid>
        </Grid>

        {/* Icons Row 2 */}
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={3}><ArchitectureIcon fontSize="large" /></Grid>
          <Grid item xs={3}><DesignServicesIcon fontSize="large" /></Grid>
          <Grid item xs={3}><AutoAwesomeIcon fontSize="large" /></Grid>
          <Grid item xs={3}><PublicIcon fontSize="large" /></Grid>
        </Grid>
      </Item>
    </Grid>

    {/* Right column – placeholder */}
    <Grid item xs={12} md={6}>
      <Item sx={{ border: "1px solid #ccc", padding: 3, minHeight: 400 }}>
        {/* Paragraphs */}
        <Typography sx={{ mb: 2 }}>
          Minimal techno is a minimalist subgenre of techno music. It is characterized by a stripped-down aesthetic that exploits the use of repetition and understated development. Minimal techno is thought to have been originally developed in the early 1990s by Detroit-based producers Robert Hood and Daniel Bell.
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Such trends saw the demise of the soul-infused techno that typified the original Detroit sound. Robert Hood has noted that he and Daniel Bell both realized something was missing from techno in the post-rave era.
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Design is a plan or specification for the construction of an object or system or for the implementation of an activity or process, or the result of that plan or specification in the form of a prototype, product or process. The national agency for design: enabling Singapore to use design for economic growth and to make lives better.
        </Typography>
      </Item>
    </Grid>

  </Grid>
</Box>

        </Container>
    </>
  )
}
