import { useMemo, useEffect, useState, type MouseEvent } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
  Popover,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { useNavigate } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type Slide = { src: string; alt: string };

export default function StartSection() {
  const [startDate, setStartDate] = useState<Date>(new Date("2023-01-20"));
  const [endDate, setEndDate] = useState<Date>(new Date("2023-01-30"));

  const formatDate = (d: Date) => d.toISOString().slice(0, 10);
  const formatDisplay = (d: Date) => dayjs(d).format("DD MMM");
  const dateLabel = `${formatDisplay(startDate)} - ${formatDisplay(endDate)}`;

  useEffect(() => {
    if (dayjs(endDate).isBefore(dayjs(startDate), "day")) {
      setEndDate(startDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

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
      // people: String(people),
    }).toString();

    navigate(`/roomsexplore?${qs}`);
  };

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(active + 1), 3500);
    return () => window.clearInterval(id);
  }, [active, paused]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const onOpenPicker = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const onClosePicker = () => setAnchorEl(null);

  // preload للصور
  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
  }, [slides]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%", bgcolor: "#fff", overflowX: "hidden" }}>
        <Box sx={{ py: { xs: 5, md: 8 } }}>
          <Container maxWidth={false} disableGutters>
            <Box sx={{ px: { xs: 2, sm: 4, md: 8, lg: 12 } }}>
              {/* ✅ مسافة أكبر بين العمودين */}
              <Grid
                container
                spacing={{ xs: 3, md: 8 }}
                alignItems="center"
                sx={{ width: "100%" }}
              >
                {/* LEFT (أصغر شوية) */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={2.2}>
                    <Typography
                      variant={mdUp ? "h2" : "h3"}
                      sx={{
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.05,
                        color: "#142B55",
                      }}
                    >
                      Forget Busy Work,
                      <br />
                      Start Next Vacation
                    </Typography>

                    <Typography
                      sx={{
                        maxWidth: 520,
                        color: "rgba(20,43,85,0.55)",
                        fontSize: 15,
                        lineHeight: 1.6,
                      }}
                    >
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
                          <Box
                            sx={{
                              p: 2,
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                              flexDirection: { xs: "column", sm: "row" },
                              minWidth: { xs: 280, sm: "unset" },
                            }}
                          >
                            <DatePicker
                              label="Start"
                              value={dayjs(startDate)}
                              onChange={(v: Dayjs | null) => {
                                if (!v) return;
                                setStartDate(v.toDate());
                              }}
                              slotProps={{ textField: { size: "small", fullWidth: true } as any }}
                            />

                            <DatePicker
                              label="End"
                              minDate={dayjs(startDate)}
                              value={dayjs(endDate)}
                              onChange={(v: Dayjs | null) => {
                                if (!v) return;
                                setEndDate(v.toDate());
                              }}
                              slotProps={{ textField: { size: "small", fullWidth: true } as any }}
                            />

                            <Button
                              onClick={onClosePicker}
                              variant="contained"
                              sx={{
                                textTransform: "none",
                                fontWeight: 800,
                                width: { xs: "100%", sm: "auto" },
                              }}
                            >
                              Done
                            </Button>
                          </Box>
                        </Popover>

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
                            width: { xs: "100%", sm: 230 },
                            maxWidth: 360,
                            borderRadius: 1.6,
                            textTransform: "none",
                            fontWeight: 800,
                            boxShadow: "0 10px 22px rgba(56,92,255,0.25)",
                          }}
                        >
                          Explore
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    sx={{
                      width: "100%",
                      mt: { xs: 2, md: 0 },

                      ml: "auto",

                      pl: { md: 7, lg: 15 },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",

                        maxWidth: { md: 810, lg: 920, xl: 920 },

                        ml: "auto",

                        aspectRatio: { xs: "4 / 3", md: "10 / 12" },
                        minHeight: { xs: 260, sm: 340, md: 480 },
                        overflow: "hidden",
                        bgcolor: "#eaf3ff",
                        boxShadow: "0 24px 60px rgba(20,43,85,0.14)",
                        borderRadius: 0,
                        borderTopLeftRadius: { xs: 60, sm: 80, md: 110 },
                      }}
                    >
                      {slides.map((s, i) => (
                        <Box
                          key={s.src}
                          component="img"
                          src={s.src}
                          alt={s.alt}
                          sx={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: i === active ? 1 : 0,
                            transition: "opacity 650ms ease",
                            willChange: "opacity",
                            transform: i === active ? "scale(1.02)" : "scale(1.06)",
                          }}
                        />
                      ))}

                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 14,
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                          zIndex: 2,
                        }}
                      >
                        {slides.map((_, i) => (
                          <Box
                            key={i}
                            onClick={() => go(i)}
                            sx={{
                              width: i === active ? 22 : 8,
                              height: 8,
                              borderRadius: 999,
                              bgcolor: i === active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
                              cursor: "pointer",
                              transition: "all 220ms ease",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}




