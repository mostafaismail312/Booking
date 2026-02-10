import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import { useNavigate, useParams } from "react-router-dom";
import { ADMIN_URLS } from "../../../services/apiEndpoints";
import { axiosInstance } from "../../../services/axiosInstance";
import { ADS_LIST_PATH } from "../../../services/paths";

type ApiRoom = {
  _id: string;
  roomNumber?: string;
  price?: number;
  capacity?: number;
  discount?: number;
  facilities?: string[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
};

type ApiCreatedBy = {
  _id: string;
  userName?: string;
};

type ApiAdDetails = {
  _id: string;
  isActive: boolean;
  room: ApiRoom;
  createdBy?: ApiCreatedBy;
  createdAt: string;
  updatedAt: string;
};

function currency(n?: number) {
  if (n === null || n === undefined) return "";
  return `$${n}`;
}

function getImage(ad?: ApiAdDetails) {
  return ad?.room?.images?.[0] || "https://picsum.photos/1400/900?blur=1";
}

export default function MostPopularDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ad, setAd] = useState<ApiAdDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Optional: token لو ال endpoint محتاج auth
  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const run = async () => {
      if (!id) {
        setError("Missing ad id");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

       
       const BASE ="https://upskilling-egypt.com:3000" // أو أي env عندك
const url = `${BASE}/api/v0/portal/ads/${id}`;

        const res = await axiosInstance.get(url
        );

      
        const item: ApiAdDetails | null = res.data?.data?.ads ?? null;
        setAd(item);
      } catch (e: any) {
      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Unknown error";

      console.log("DETAILS_ERROR:", { status, msg, data: e?.response?.data });
      setError(`${status ? `(${status}) ` : ""}${msg}`);
    } finally {
      setLoading(false);
    }
    };

    run();
  }, [id, token]);

  const img = getImage(ad ?? undefined);
  const title = ad?.room?.roomNumber ? ad.room.roomNumber : "Room";
  const price = ad?.room?.price ?? 0;
  const discount = ad?.room?.discount ?? 0;
  const capacity = ad?.room?.capacity ?? 0;
  const owner = ad?.createdBy?.userName ?? "Unknown";

  return (
    <Box sx={{ py: { xs: 3, md: 5 }, bgcolor: "#fff", minHeight: "100vh" }}>
      <Container maxWidth={false} disableGutters>
        <Box sx={{ px: { xs: 2, md: 8 } }}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate(-1)}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                color: "#142B55",
              }}
            >
              Back
            </Button>

            {!loading && ad && (
              <Chip
                label={ad.isActive ? "Active" : "Inactive"}
                sx={{
                  bgcolor: ad.isActive ? "#1DBA88" : "rgba(20,43,85,0.12)",
                  color: ad.isActive ? "#fff" : "#142B55",
                  fontWeight: 900,
                  px: 1,
                }}
              />
            )}
          </Stack>

          {/* Error */}
          {error && !loading && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid rgba(20,43,85,0.08)",
                bgcolor: "rgba(241,82,58,0.06)",
                mb: 2,
              }}
            >
              <Typography sx={{ color: "#F1523A", fontWeight: 900 }}>
                {error}
              </Typography>
            </Paper>
          )}

          {/* Loading */}
          {loading && (
            <Stack spacing={2}>
              <Skeleton variant="rounded" height={420} sx={{ borderRadius: 3 }} />
              <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
              <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
            </Stack>
          )}

          {/* Content */}
          {!loading && ad && (
            <Stack spacing={2.2}>
              {/* Image hero */}
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 280, md: 460 },
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 24px 60px rgba(20,43,85,0.14)",
                  bgcolor: "#eaf3ff",
                }}
              >
                <Box
                  component="img"
                  src={img}
                  alt={title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scale(1.02)",
                  }}
                />

                {/* overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.65) 100%)",
                  }}
                />

                {/* Title & price pill */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 18,
                    right: 18,
                    bottom: 18,
                    color: "#fff",
                  }}
                >
                  <Typography sx={{ fontWeight: 950, fontSize: { xs: 22, md: 30 } }}>
                    {title}
                  </Typography>
                  <Typography sx={{ opacity: 0.9, fontWeight: 700, mt: 0.5 }}>
                    {currency(price)} / night
                  </Typography>
                </Box>

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
                    fontWeight: 900,
                    fontSize: 13,
                    boxShadow: "0 10px 24px rgba(255,77,141,0.35)",
                  }}
                >
                  {discount > 0 ? `Discount: ${discount}` : "No discount"}
                </Box>
              </Box>

              {/* Details Card */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 2.5 },
                  borderRadius: 3,
                  border: "1px solid rgba(20,43,85,0.08)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 950,
                    color: "#142B55",
                    fontSize: { xs: 18, md: 20 },
                    mb: 1.2,
                  }}
                >
                  Details
                </Typography>

                <Stack spacing={1.2}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <AttachMoneyRoundedIcon sx={{ color: "rgba(20,43,85,0.65)" }} />
                    <Typography sx={{ color: "rgba(20,43,85,0.8)", fontWeight: 800 }}>
                      Price:
                    </Typography>
                    <Typography sx={{ color: "#142B55", fontWeight: 950 }}>
                      {currency(price)} / night
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <PeopleAltRoundedIcon sx={{ color: "rgba(20,43,85,0.65)" }} />
                    <Typography sx={{ color: "rgba(20,43,85,0.8)", fontWeight: 800 }}>
                      Capacity:
                    </Typography>
                    <Typography sx={{ color: "#142B55", fontWeight: 950 }}>
                      {capacity} persons
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <LocalOfferRoundedIcon sx={{ color: "rgba(20,43,85,0.65)" }} />
                    <Typography sx={{ color: "rgba(20,43,85,0.8)", fontWeight: 800 }}>
                      Discount:
                    </Typography>
                    <Typography sx={{ color: "#142B55", fontWeight: 950 }}>
                      {discount > 0 ? discount : 0}
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 0.6, borderColor: "rgba(20,43,85,0.08)" }} />

                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <PersonRoundedIcon sx={{ color: "rgba(20,43,85,0.65)" }} />
                    <Typography sx={{ color: "rgba(20,43,85,0.8)", fontWeight: 800 }}>
                      Created by:
                    </Typography>
                    <Typography sx={{ color: "#142B55", fontWeight: 950 }}>
                      {owner}
                    </Typography>
                  </Stack>

                  {/* <Typography sx={{ mt: 1, color: "rgba(20,43,85,0.55)", fontWeight: 700 }}>
                    Ad ID: {ad._id}
                  </Typography>
                  <Typography sx={{ color: "rgba(20,43,85,0.55)", fontWeight: 700 }}>
                    Room ID: {ad.room?._id}
                  </Typography> */}
                </Stack>

                {/* Actions */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/rooms")}
                    sx={{
                      height: 44,
                      borderRadius: 1.6,
                      textTransform: "none",
                      fontWeight: 950,
                      boxShadow: "0 10px 20px rgba(56,92,255,0.25)",
                    }}
                  >
                    Explore more rooms
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{
                      height: 44,
                      borderRadius: 1.6,
                      textTransform: "none",
                      fontWeight: 900,
                      borderColor: "rgba(20,43,85,0.2)",
                      color: "#142B55",
                    }}
                  >
                    Back
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
}

