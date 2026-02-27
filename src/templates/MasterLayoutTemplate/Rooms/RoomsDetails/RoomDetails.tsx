import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material"; // ✅ زي ما طلبت (متغيرتش)
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import {
  Button,
  CircularProgress,
  Container,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { axiosInstance } from "../../../../services/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { ADMIN_URLS, PORTAL_URLS } from "../../../../services/apiEndpoints";

import MusicNoteIcon from "@mui/icons-material/MusicNote";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import AlbumIcon from "@mui/icons-material/Album";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PublicIcon from "@mui/icons-material/Public";

import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateTimeRangePicker } from "@mui/x-date-pickers-pro/DateTimeRangePicker";
import { Dayjs } from "dayjs";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

interface Room {
  _id: string;
  images: string[];
  price: number;
  discount: number;
}

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  // Feedback & Comment states
  const [ratingValue, setRatingValue] = useState<number | null>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Booking UI states
  const [isBooking, setIsBooking] = useState(false);

  /**
   * ✅ Token helpers (supports JSON stored token)
   * - reads token/accessToken/authToken
   * - supports {"token":"Bearer ..."} or "\"Bearer ...\""
   * - returns raw jwt (without Bearer)
   */
  const getRawToken = () => {
    const keys = ["token", "accessToken", "authToken"];

    let raw = "";
    for (const k of keys) {
      const v = localStorage.getItem(k);
      if (v) {
        raw = v;
        break;
      }
    }
    if (!raw) return "";

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string") raw = parsed;
      else if (parsed?.token) raw = parsed.token;
      else if (parsed?.accessToken) raw = parsed.accessToken;
    } catch {
      // not JSON -> ignore
    }

    const cleaned = String(raw).replace(/^"+|"+$/g, "").trim();
    if (!cleaned) return "";

    return cleaned.replace(/^Bearer\s+/i, "").trim();
  };

  const tokenRaw = getRawToken();
  const isLoggedIn = !!tokenRaw;

  // Booking states
  const [bookingRange, setBookingRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);
  const [nights, setNights] = useState<number>(0);

  // ✅ Helper: resolve image URL (STRONG)
  const resolveImg = useMemo(() => {
    const apiBase = axiosInstance.defaults.baseURL ?? "";

    // origin = https://upskilling-egypt.com:3000
    let origin = "";
    try {
      origin = apiBase ? new URL(apiBase).origin : window.location.origin;
    } catch {
      origin = window.location.origin;
    }

    return (u?: string) => {
      if (!u) return "";

      // full URL
      if (/^https?:\/\//i.test(u)) return u;

      // clean ./ and spaces
      const cleaned = String(u).trim().replace(/^\.\//, "");
      const path = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;

      // api path
      if (path.startsWith("/api/") || path.startsWith("/api/v0/")) {
        return `${origin}${path}`;
      }

      // uploads path
      if (path.startsWith("/uploads/") || path.startsWith("/upload/")) {
        return `${origin}${path}`;
      }

      // images/static
      if (path.startsWith("/images/") || path.startsWith("/static/")) {
        return `${origin}${path}`;
      }

      // fallback
      return `${origin}${path}`;
    };
  }, []);


  const PLACEHOLDER = "/forget.jpg";

  const imgSrc = (u?: string) => {
    const s = resolveImg(u);
    return s ? s : PLACEHOLDER;
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const el = e.currentTarget;
    if (el.src.includes(PLACEHOLDER)) return; 
    el.src = PLACEHOLDER;
  };

  // ✅ Calculate nights (robust)
  useEffect(() => {
    const [start, end] = bookingRange;

    if (!start || !end) {
      setNights(0);
      return;
    }

    const minutes = end.diff(start, "minute");
    if (minutes <= 0) {
      setNights(0);
      return;
    }

    const days = end.startOf("day").diff(start.startOf("day"), "day");
    setNights(Math.max(1, days));
  }, [bookingRange]);

  const handleSendComment = async () => {
    if (!commentText.trim() || !id) {
      alert("Please write a comment first");
      return;
    }

    const t = getRawToken();
    if (!t) {
      alert("Please login first");
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
        payload,
        {
          headers: {
            Authorization: `Bearer ${t}`,
            token: `Bearer ${t}`, // ✅ fixed
            "x-access-token": t,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("Comment posted successfully!");
        setCommentText("");
      } else {
        alert("Unexpected response from server");
      }
    } catch (error: any) {
      console.error("Error posting comment:", error);
      const msg =
        error.response?.data?.message || error.message || "Failed to post comment";
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

  /**
   * ✅ TOTAL PRICE FIX
   * total = (price - discount) * nights (never negative)
   */
  const totalPrice = Math.max(0, (room.price - room.discount) * nights);

  // ✅ book enabled only when:
  const canBook =
    isLoggedIn && !!bookingRange[0] && !!bookingRange[1] && nights > 0 && !isBooking;

  /**
   * ✅ Details page: Create booking ONLY, then navigate to checkout page
   * Checkout page will handle Stripe CardElement + createToken + pay call
   */
  const handleBook = async () => {
    try {
      if (!id) return alert("Room id is missing");
      if (!bookingRange[0] || !bookingRange[1])
        return alert("choose start date and end date");

      const t = getRawToken();
      if (!t) return alert("token is required - please login");

      setIsBooking(true);

      const createPayload = {
        startDate: bookingRange[0].toDate().toISOString(),
        endDate: bookingRange[1].toDate().toISOString(),
        room: id, 
        totalPrice: Number(totalPrice),
      };

      const headers = {
        Authorization: `Bearer ${t}`,
        token: `Bearer ${t}`,
        "x-access-token": t,
      };

      const createRes = await axiosInstance.post(
        PORTAL_URLS.BOOKING.CREATE_BOOKING,
        createPayload,
        { headers }
      );

      console.log("CREATE_BOOKING response FULL:", createRes.data);

      const bookingId =
        createRes.data?.data?.bookingId ||
        createRes.data?.data?._id ||
        createRes.data?.data?.booking?._id ||
        createRes.data?.booking?._id ||
        createRes.data?._id;

      if (!bookingId) {
        throw new Error("Booking id not found in create booking response");
      }

      navigate(`/checkout/${bookingId}`, {
        state: { totalPrice, nights },
      });
    } catch (e: any) {
      console.error("CREATE_BOOKING ERROR (raw):", e);

      if (axios.isAxiosError(e)) {
        console.error("CREATE_BOOKING message:", e.message);
        console.error("CREATE_BOOKING code:", e.code);
        console.error("CREATE_BOOKING status:", e.response?.status);
        console.error("CREATE_BOOKING data:", e.response?.data);
        console.error("CREATE_BOOKING url:", e.config?.baseURL, e.config?.url);
      } else {
        console.error("Non-axios error:", e?.message);
      }

      alert(e?.response?.data?.message || e?.message || "Failed to create booking");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Container maxWidth="lg">
      {/* ===== Images Section ===== */}
      <Box sx={{ width: "100%", mt: 3 }}>
        <Grid container spacing={2} alignItems="stretch">
          {/* Left big image */}
          <Grid item xs={12} md={6} sx={{ flexBasis: "45%", maxWidth: "45%", ml: "6%" }}>
            <Box
              component="img"
              src={imgSrc(room.images?.[0])}
              onError={handleImgError}
              alt="Room main"
              sx={{
                width: "100%",
                height: 450,
                borderRadius: 2,
                objectFit: "cover",
              }}
            />
          </Grid>

          {/* Right column images */}
          <Grid item xs={12} md={6} sx={{ flexBasis: "40%", maxWidth: "40%" }}>
            <Grid container spacing={2} direction="column" sx={{ height: "100%" }}>
              <Grid item xs={12}>
                <Box
                  component="img"
                  src={imgSrc(room.images?.[1])}
                  onError={handleImgError}
                  alt="Room view 1"
                  sx={{
                    width: "100%",
                    height: 215,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  component="img"
                  src={imgSrc(room.images?.[2])}
                  onError={handleImgError}
                  alt="Room view 2"
                  sx={{
                    width: "100%",
                    height: 215,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* ===== Details + Booking Section ===== */}
      <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: 1000 } }}>
          <Grid container spacing={3} alignItems="stretch">
            {/* Left column – description */}
            <Grid item xs={12} md={6} sx={{ width: "48%" }}>
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
                    Minimal techno is a minimalist subgenre of techno music.
                  </Typography>
                  <Typography sx={{ mb: 2 }}>
                    Such trends saw the demise of the soul-infused techno.
                  </Typography>
                  <Typography sx={{ mb: 3 }}>
                    Design is a plan or specification for the construction of an object.
                  </Typography>
                </Box>

                <Box>
                  <Grid container spacing={4} justifyContent="center" sx={{ mb: 2 }}>
                    <Grid item xs={3}>
                      <MusicNoteIcon fontSize="large" />
                    </Grid>
                    <Grid item xs={3}>
                      <GraphicEqIcon fontSize="large" />
                    </Grid>
                    <Grid item xs={3}>
                      <HeadphonesIcon fontSize="large" />
                    </Grid>
                    <Grid item xs={3}>
                      <AlbumIcon fontSize="large" />
                    </Grid>
                  </Grid>

                  <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={3}>
                      <ArchitectureIcon fontSize="large" />
                    </Grid>
                    <Grid item xs={3}>
                      <DesignServicesIcon fontSize="large" />
                    </Grid>
                    <Grid item xs={3}>
                      <AutoAwesomeIcon fontSize="large" />
                    </Grid>
                    <Grid item xs={3}>
                      <PublicIcon fontSize="large" />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Right column – booking panel */}
            <Grid item xs={12} md={6} sx={{ width: "48%" }}>
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

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Box>
                    <Typography variant="subtitle1" color="primary">
                      ${room.price} per night
                    </Typography>

                    {room.discount > 0 && (
                      <Typography variant="subtitle1" color="red">
                        Discount ${room.discount} / night
                      </Typography>
                    )}
                  </Box>

                  {nights > 0 && (
                    <Typography variant="body1" fontWeight="medium">
                      {nights} {nights === 1 ? "night" : "nights"}
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
                  />
                </LocalizationProvider>

                {!isLoggedIn && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                    Please login to book this room
                  </Typography>
                )}

                <Button variant="contained" color="primary" disabled={!canBook} onClick={handleBook}>
                  {isBooking ? <CircularProgress size={22} color="inherit" /> : "Book"}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* ===== Feedback & Comments ===== */}
      <Box sx={{ mt: 20, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: 1000 } }}>
          <Grid container spacing={4} alignItems="stretch">
            {/* Left – Rate */}
            <Grid item xs={12} md={6} sx={{ width: "45%" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Typography variant="h6">Rate</Typography>
                <Rating
                  name="room-rating"
                  value={ratingValue}
                  onChange={(event, newValue) => setRatingValue(newValue)}
                  readOnly={!isLoggedIn}
                />

                <TextField
                  label="Your Feedback"
                  multiline
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  disabled={!isLoggedIn}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90caf9" },
                      "&:hover fieldset": { borderColor: "#42a5f5" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button sx={{ width: "50%" }} variant="contained" color="primary" disabled={!isLoggedIn}>
                    Rate
                  </Button>

                  {!isLoggedIn && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                      Please login to rate this room
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Vertical line */}
            <Grid
              sx={{
                display: { xs: "none", md: "block" },
                width: 8,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "50%",
                  width: "1px",
                  backgroundColor: "#42a5f5",
                  transform: "translateX(-50%)",
                }}
              />
            </Grid>

            {/* Right – Comment */}
            <Grid item xs={12} md={6} sx={{ width: "48%" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Typography variant="h6">Add Your Comment</Typography>
                <TextField
                  label="Comment"
                  multiline
                  rows={8}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#90caf9" },
                      "&:hover fieldset": { borderColor: "#42a5f5" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
                <Button
                  sx={{ width: "50%", mb: 4 }}
                  variant="contained"
                  color="primary"
                  onClick={handleSendComment}
                  disabled={isSubmittingComment || !commentText.trim()}
                >
                  {isSubmittingComment ? <CircularProgress size={24} color="inherit" /> : "Send"}
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: { xs: "block", md: "none" },
              my: 4,
              height: "1px",
              backgroundColor: "#e0e0e0",
              width: "100%",
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}


