import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import {
  Button,
  CircularProgress,
  Container,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { axiosInstance } from '../../../../services/axiosInstance';
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
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import dayjs, { Dayjs } from 'dayjs';

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
  const { id } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  // Feedback & Comment states
  const [ratingValue, setRatingValue] = useState<number | null>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Booking states
  const [bookingRange, setBookingRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [nights, setNights] = useState<number>(0);

  // Calculate nights
  useEffect(() => {
    const [start, end] = bookingRange;

    if (!start || !end || end.isBefore(start, 'day')) {
      setNights(0);
      return;
    }

    const calculatedNights = end.diff(start, 'day');
    setNights(calculatedNights > 0 ? calculatedNights : 1);
  }, [bookingRange]);

  const handleSendComment = async () => {
    if (!commentText.trim() || !id) {
      alert("Please write a comment first");
      return;
    }

    setIsSubmittingComment(true);

    try {
      const payload = {
        roomId: id,
        comment: commentText.trim(),
      };

      const response = await axiosInstance.post(
        PORTAL_URLS.ROOMS.ADD_ROOM_COMMENT(id),
        payload
      );

      if (response.status === 201 || response.status === 200) {
        alert("Comment posted successfully!");
        setCommentText("");
      } else {
        alert("Unexpected response from server");
      }
    } catch (error: any) {
      console.error("Error posting comment:", error);
      const msg = error.response?.data?.message || error.message || "Failed to post comment";
      alert(msg);
    } finally {
      setIsSubmittingComment(false);
    }
  };

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

  const pricePerNight = 600;
  const totalPrice = nights * pricePerNight;

  return (
    <Container maxWidth="lg">
      {/* ===== Images Section ===== */}
      <Box sx={{ width: "100%", mt: 3 }}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={6} sx={{ width: '45%' , marginLeft: '6%'}}>
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

          <Grid item xs={12} md={6} sx={{ width: '40%' }}>
            <Grid container spacing={2} direction="column" sx={{ height: "100%" }}>
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

      {/* ===== Details + Booking Section ===== */}
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: 1000 } }}>
          <Grid container spacing={3} alignItems="stretch">
            {/* Left column – description */}
            <Grid item xs={12} md={6} sx={{ width: '48%' }}>
              <Paper
                sx={{
                  border: "1px solid #ccc",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  minHeight: 360,
                }}
              >
                <Box>
                  <Typography sx={{ mb: 2 }}>
                    Minimal techno is a minimalist subgenre of techno music. It is characterized by a stripped-down aesthetic that exploits the use of repetition and understated development. Minimal techno is thought to have been originally developed in the early 1990s by Detroit-based producers Robert Hood and Daniel Bell.
                  </Typography>

                  <Typography sx={{ mb: 2 }}>
                    Such trends saw the demise of the soul-infused techno that typified the original Detroit sound. Robert Hood has noted that he and Daniel Bell both realized something was missing from techno in the post-rave era.
                  </Typography>

                  <Typography sx={{ mb: 3 }}>
                    Design is a plan or specification for the construction of an object or system or for the implementation of an activity or process, or the result of that plan or specification in the form of a prototype, product or process. The national agency for design: enabling Singapore to use design for economic growth and to make lives better.
                  </Typography>
                </Box>

                <Box>
                  <Grid container spacing={12} justifyContent="center" sx={{ mb: 2 }}>
                    <Grid item xs={3}><MusicNoteIcon fontSize="large" /></Grid>
                    <Grid item xs={3}><GraphicEqIcon fontSize="large" /></Grid>
                    <Grid item xs={3}><HeadphonesIcon fontSize="large" /></Grid>
                    <Grid item xs={3}><AlbumIcon fontSize="large" /></Grid>
                  </Grid>
                  <Grid container spacing={12} justifyContent="center">
                    <Grid item xs={3}><ArchitectureIcon fontSize="large" /></Grid>
                    <Grid item xs={3}><DesignServicesIcon fontSize="large" /></Grid>
                    <Grid item xs={3}><AutoAwesomeIcon fontSize="large" /></Grid>
                    <Grid item xs={3}><PublicIcon fontSize="large" /></Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Right column – booking panel */}
            <Grid item xs={12} md={6} sx={{ width: '48%' }}>
              <Paper
                sx={{
                  border: "1px solid #ccc",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  height: "100%",
                  minHeight: 360,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Start Booking
                </Typography>

                {/* Price + nights count side by side */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Box>
                    <Typography variant="subtitle1" color="primary">
                      $600 per night
                    </Typography>
                    <Typography variant="subtitle1" color="red">
                      Discount 20% Off
                    </Typography>
                  </Box>

                  {nights > 0 && (
                    <Typography variant="body1" fontWeight="medium">
                      {nights} {nights === 1 ? 'night' : 'nights'}
                    </Typography>
                  )}
                </Box>

                {nights > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
                    Total ≈ ${totalPrice}
                  </Typography>
                )}

                <Typography variant="subtitle1" color="primary" sx={{ mt: 2 }}>
                  Pick a Date
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimeRangePicker
                    value={bookingRange}
                    onChange={(newValue) => setBookingRange(newValue)}
                    calendars={2}
                    renderInput={(startProps, endProps) => (
                      <>
                        <TextField {...startProps} fullWidth sx={{ mb: 2 }} />
                        <TextField {...endProps} fullWidth />
                      </>
                    )}
                  />
                </LocalizationProvider>

                <Button
                  variant="contained"
                  color="primary"
                  disabled={nights === 0 || !bookingRange[0] || !bookingRange[1]}
                >
                  Book
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* ===== Feedback & Comments ===== */}
      <Box sx={{ mt: 20, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: 1000 } }}>
          <Grid container spacing={4} alignItems="stretch">
            {/* Left – Rate */}
            <Grid item xs={12} md={6} sx={{ width: '45%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Typography variant="h6">Rate</Typography>
                <Rating
                  name="room-rating"
                  value={ratingValue}
                  onChange={(event, newValue) => setRatingValue(newValue)}
                />
                <TextField
                  label="Your Feedback"
                  multiline
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#90caf9' },
                      '&:hover fieldset': { borderColor: '#42a5f5' },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1976d2',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
                <Button sx={{ width: '50%' }} variant="contained" color="primary">
                  Rate
                </Button>
              </Box>
            </Grid>

            {/* Vertical line */}
            <Grid
              item
              md={0.1}
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '50%',
                  width: '1px',
                  backgroundColor: '#42a5f5',
                  transform: 'translateX(-50%)',
                }}
              />
            </Grid>

            {/* Right – Comment */}
            <Grid item xs={12} md={5.9} sx={{ width: '48%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Typography variant="h6">Add Your Comment</Typography>
                <TextField
                  label="Comment"
                  multiline
                  rows={8}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#90caf9' },
                      '&:hover fieldset': { borderColor: '#42a5f5' },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1976d2',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
                <Button
                  sx={{ width: '50%' }}
                  variant="contained"
                  color="primary"
                  onClick={handleSendComment}
                  disabled={isSubmittingComment || !commentText.trim()}
                >
                  {isSubmittingComment ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Send'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: { xs: 'block', md: 'none' },
              my: 4,
              height: '1px',
              backgroundColor: '#e0e0e0',
              width: '100%',
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}