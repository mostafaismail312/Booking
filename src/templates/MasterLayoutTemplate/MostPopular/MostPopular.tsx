import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  IconButton,
  Skeleton,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import { ADMIN_URLS, PORTAL_URLS } from "../../../services/apiEndpoints";
import { axiosInstance } from "../../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type ApiRoom = {
  _id: string;
  roomNumber?: string;
  price?: number;
  capacity?: number;
  discount?: number;
  images?: string[];
};

type ApiAd = {
  _id: string;
  isActive: boolean;
  room: ApiRoom;
  createdAt: string;
};

function currency(n?: number) {
  if (n === null || n === undefined) return "";
  return `$${n}`;
}

function getImage(ad: ApiAd) {
  return ad?.room?.images?.[0] || "https://picsum.photos/1200/800?blur=1";
}

function getTitle(ad: ApiAd) {
  return ad?.room?.roomNumber ? ad.room.roomNumber : "Room";
}

function getLocationFallback() {
  return "Indonesia";
}

function AdCard({
  ad,
  variant,
  onFavourite,
  onView,
}: {
  ad: ApiAd;
  variant: "large" | "small";
  onFavourite: (roomId: string) => void; // ✅ roomId
  onView: (adId: string) => void;
}) {
  const img = getImage(ad);
  const title = getTitle(ad);

  const price = ad?.room?.price ?? 0;
  const priceLabel = `${currency(price)} per night`;

  const radius = variant === "large" ? 10 : 8;
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(ad._id)}
      sx={{
        position: "relative",
        height: variant === "large" ? { xs: 300, md: 420 } : { xs: 190, md: 200 },
        borderRadius: radius,
        overflow: "hidden",
        boxShadow: "0 18px 50px rgba(20,43,85,0.14)",
        bgcolor: "#eaf3ff",
        cursor: "pointer",
        transition: "transform 220ms ease, box-shadow 220ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 26px 70px rgba(20,43,85,0.20)",
        },
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src={img}
        alt={title}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: hovered ? "scale(1.05)" : "scale(1.02)",
          transition: "transform 500ms ease",
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.38) 65%, rgba(0,0,0,0.60) 100%)",
        }}
      />

      {/* Hover actions in the CENTER */}
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: hovered
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.92)",
          display: "flex",
          gap: 1,
          opacity: hovered ? 1 : 0,
          transition: "opacity 200ms ease, transform 200ms ease",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        {/* ✅ Add to favourites uses roomId */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onFavourite(ad.room?._id);
          }}
          sx={{
            bgcolor: "rgba(255,255,255,0.25)",
            color: "#fff",
            backdropFilter: "blur(6px)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.35)" },
          }}
        >
          <FavoriteBorderRoundedIcon />
        </IconButton>

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onView(ad._id);
          }}
          sx={{
            bgcolor: "rgba(255,255,255,0.25)",
            color: "#fff",
            backdropFilter: "blur(6px)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.35)" },
          }}
        >
          <VisibilityRoundedIcon />
        </IconButton>
      </Box>

      {/* Price pill */}
      <Box
        sx={{
          position: "absolute",
          top: 14,
          right: 14,
          px: 2,
          py: 0.8,
          borderRadius: 999,
          bgcolor: "#FF4D8D",
          color: "#fff",
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: "0.2px",
          boxShadow: "0 10px 24px rgba(255,77,141,0.35)",
        }}
      >
        {priceLabel}
      </Box>

      {/* Bottom text */}
      <Box
        sx={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 16,
          color: "#fff",
        }}
      >
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: variant === "large" ? 20 : 18,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ opacity: 0.85, fontWeight: 600, fontSize: 13 }}>
          {getLocationFallback()}
        </Typography>
      </Box>
    </Box>
  );
}

export default function MostPopular() {
  const [ads, setAds] = useState<ApiAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Dialog state
  const [loginOpen, setLoginOpen] = useState(false);

  const navigate = useNavigate();

  // token check
  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axiosInstance.get(ADMIN_URLS.ADS.GET_ALL_ADS);
        const list: ApiAd[] = res.data?.data?.ads ?? [];
        setAds(list.slice(0, 5));
      } catch (e: any) {
        setError("Failed to load ads");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const first = ads[0];
  const rest = ads.slice(1, 5);

  // ✅ Add to favourites then navigate to favourites
  const handleFavourite = async (roomId: string) => {
    if (!token) {
      setLoginOpen(true);
      return;
    }

    if (!roomId) {
      toast.error("Room not found");
      return;
    }

    try {
    
      await axiosInstance.post(PORTAL_URLS.ROOMS.ADD_TO_FAVORITES, { roomId });

      toast.success("Added to favourites");
      navigate("/fav-list");
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 409) {
        toast("Already in favourites");
        navigate("/fav-list");
        return;
      }

      toast.error("Failed to add to favourites");
      console.error(e);
    }
  };

  const handleView = (adId: string) => {
    navigate(`/most-popular-details/${adId}`);
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#fff" }}>
      <Container maxWidth={false} disableGutters>
        <Box sx={{ px: { xs: 2, md: 8 } }}>
          <Typography
            sx={{
              fontWeight: 900,
              color: "#142B55",
              fontSize: { xs: 20, md: 26 },
              mb: 2,
            }}
          >
            Most popular ads
          </Typography>

          {error && (
            <Typography sx={{ color: "error.main", mb: 2, fontWeight: 700 }}>
              {error}
            </Typography>
          )}

          {/* Loading skeletons */}
          {loading && (
            <Grid container spacing={3} alignItems="stretch">
              <Grid size={5}>
                <Skeleton variant="rounded" height={420} sx={{ borderRadius: 3 }} />
              </Grid>
              <Grid size={7}>
                <Grid container spacing={3}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Grid key={i} size={6}>
                      <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* Content */}
          {!loading && ads.length > 0 && (
            <Grid container spacing={3} alignItems="stretch">
              {/* Left big card */}
              <Grid size={5}>
                <AdCard
                  ad={first}
                  variant="large"
                  onFavourite={handleFavourite}
                  onView={handleView}
                />
              </Grid>

              {/* Right 2x2 grid */}
              <Grid size={7}>
                <Grid container spacing={3}>
                  {rest.map((ad) => (
                    <Grid key={ad._id} size={6}>
                      <AdCard
                        ad={ad}
                        variant="small"
                        onFavourite={handleFavourite}
                        onView={handleView}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}

          {!loading && !error && ads.length === 0 && (
            <Typography sx={{ color: "rgba(20,43,85,0.6)", fontWeight: 700 }}>
              No ads found.
            </Typography>
          )}
        </Box>
      </Container>

      {/* Login Dialog */}
      <Dialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: "1px solid rgba(20,43,85,0.08)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: "#142B55" }}>
          Login required
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ color: "rgba(20,43,85,0.65)", lineHeight: 1.7 }}>
            You need to login first to add items to your favourites.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setLoginOpen(false)}
            sx={{
              borderRadius: 1.6,
              textTransform: "none",
              fontWeight: 800,
              borderColor: "rgba(20,43,85,0.2)",
              color: "#142B55",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setLoginOpen(false);
              navigate("/login");
            }}
            sx={{
              borderRadius: 1.6,
              textTransform: "none",
              fontWeight: 900,
              boxShadow: "0 10px 20px rgba(56,92,255,0.25)",
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
