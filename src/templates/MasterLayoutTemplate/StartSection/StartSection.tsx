
import { useMemo, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  Popover,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";


import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { useNavigate } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type Slide = { src: string; alt: string };

export default function StartSection() {
  // خليك على Date زي ما أنت (بس هنحوّل لـ dayjs جوه الـ picker)
  const [startDate, setStartDate] = useState<Date>(new Date("2023-01-20"));
  const [endDate, setEndDate] = useState<Date>(new Date("2023-01-30"));

  const formatDate = (d: Date) => d.toISOString().slice(0, 10); // للـ querystring

  // عرض لطيف في الـ UI
  const formatDisplay = (d: Date) =>
    dayjs(d).format("DD MMM"); // مثال: 20 Jan

  const dateLabel = `${formatDisplay(startDate)} - ${formatDisplay(endDate)}`;

  // لو المستخدم اختار start بعد end، ظبط end تلقائيًا
  useEffect(() => {
    if (dayjs(endDate).isBefore(dayjs(startDate), "day")) {
      setEndDate(startDate);
    }
  }, [startDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();

  const slides: Slide[] = useMemo(
    () => [
      {
        src: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1400&q=80",
        alt: "Modern cabin",
      },
      {
        src: "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1400&q=80",
        alt: "Vacation house",
      },
      {
        src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80",
        alt: "Beach stay",
      },
    ],
    []
  );

  const [people, setPeople] = useState(2);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (next: number) => {
    const len = slides.length;
    setActive(((next % len) + len) % len);
  };

  const handleExplore = () => {
    const qs = new URLSearchParams({
      page: "1",
      size: "10",
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      // لو عايز كمان تبعت people:
      // people: String(people),
    }).toString();

  navigate(`/roomsexplore?${qs}`);
};

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(active + 1), 3500);
    return () => window.clearInterval(id);
  }, [active, paused]);

  // Popover للـ datepickers
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const onOpenPicker = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const onClosePicker = () => setAnchorEl(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ py: { xs: 5, md: 8 }, bgcolor: "#fff", width: "100%" }}>
        <Container maxWidth={false} disableGutters>
          <Box sx={{ px: { xs: 6, md: 12 } }}>
            <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" sx={{ width: "100%" }}>
              {/* LEFT */}
              <Grid size={7}>
                <Stack spacing={2.2}>
                  <Typography
                    variant={mdUp ? "h2" : "h3"}
                    sx={{ fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05, color: "#142B55" }}
                  >
                    Forget Busy Work,
                    <br />
                    Start Next Vacation
                  </Typography>

                  <Typography sx={{ maxWidth: 520, color: "rgba(20,43,85,0.55)", fontSize: 15, lineHeight: 1.6 }}>
                    We provide what you need to enjoy your holiday with family.
                    <br />
                    Time to make another memorable moments.
                  </Typography>

                  <Box sx={{ pt: 1 }}>
                    <Typography sx={{ fontWeight: 800, color: "#142B55" }}>Start Booking</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "rgba(20,43,85,0.6)" }}>
                      Pick a Date
                    </Typography>

                    <Stack spacing={1.6} sx={{ mt: 1.2, maxWidth: 520 }}>
                      {/* Date row (دلوقتي بقى ديناميك من الـ picker) */}
                      <Paper
                        elevation={0}
                        onClick={onOpenPicker}
                        sx={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          borderRadius: 2,
                          border: "1px solid rgba(20,43,85,0.08)",
                          overflow: "hidden",
                          height: 46,
                        }}
                      >
                        <Box
                          sx={{
                            width: 52,
                            height: "100%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "#0E2A5A",
                          }}
                        >
                          <CalendarMonthRoundedIcon sx={{ color: "#fff" }} />
                        </Box>
                        <Box sx={{ px: 2.2, flex: 1 }}>
                          <Typography sx={{ fontWeight: 700, color: "rgba(20,43,85,0.8)" }}>
                            {dateLabel}
                          </Typography>
                        </Box>
                      </Paper>

                      <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={onClosePicker}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                      >
                        <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
                          <DatePicker
                            label="Start"
                            value={dayjs(startDate)}
                            onChange={(v: Dayjs | null) => {
                              if (!v) return;
                              setStartDate(v.toDate());
                            }}
                            slotProps={{ textField: { size: "small" } as any }}
                          />

                          <DatePicker
                            label="End"
                            minDate={dayjs(startDate)} // يمنع end قبل start
                            value={dayjs(endDate)}
                            onChange={(v: Dayjs | null) => {
                              if (!v) return;
                              setEndDate(v.toDate());
                            }}
                            slotProps={{ textField: { size: "small" } as any }}
                          />

                          <Button onClick={onClosePicker} variant="contained" sx={{ textTransform: "none", fontWeight: 800 }}>
                            Done
                          </Button>
                        </Box>
                      </Popover>

                      {/* Capacity row (زي ما هي) */}
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "rgba(20,43,85,0.6)", mb: 0.7 }}>
                          Capacity
                        </Typography>

                        <Paper
                          elevation={0}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            borderRadius: 2,
                            border: "1px solid rgba(20,43,85,0.08)",
                            overflow: "hidden",
                            height: 46,
                          }}
                        >
                          <Box sx={{ width: 72, height: "100%", display: "grid", placeItems: "center", bgcolor: "#F1523A" }}>
                            <IconButton onClick={() => setPeople((p) => Math.max(1, p - 1))} sx={{ color: "#fff" }}>
                              <RemoveRoundedIcon />
                            </IconButton>
                          </Box>

                          <Box sx={{ flex: 1, px: 2.2, textAlign: "center" }}>
                            <Typography sx={{ fontWeight: 800, color: "rgba(20,43,85,0.85)" }}>
                              {people} person
                            </Typography>
                          </Box>

                          <Box sx={{ width: 72, height: "100%", display: "grid", placeItems: "center", bgcolor: "#1DBA88" }}>
                            <IconButton onClick={() => setPeople((p) => p + 1)} sx={{ color: "#fff" }}>
                              <AddRoundedIcon />
                            </IconButton>
                          </Box>
                        </Paper>
                      </Box>

                      <Button
                        variant="contained"
                        onClick={handleExplore}
                        sx={{
                          mt: 1,
                          height: 44,
                          width: 230,
                          borderRadius: 1.6,
                          textTransform: "none",
                          fontWeight: 800,
                          boxShadow: "0 10px 20px rgba(56,92,255,0.25)",
                        }}
                      >
                        Explore
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>

              {/* RIGHT ... (كما هو عندك) */}
              <Grid size={5}>{/* ... */}</Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
